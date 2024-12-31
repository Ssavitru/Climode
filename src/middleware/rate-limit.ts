// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRateLimiter } from "@/lib/redis";

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  const ratelimit = getRateLimiter();
  
  if (!ratelimit) {
    console.warn("Rate limiter not configured, proceeding without rate limiting");
    return handler(request);
  }

  try {
    const ip = request.ip ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
    const identifier = `${request.method}_${request.nextUrl.pathname}_${ip}`;
    
    const { success, limit, reset, remaining } = await Promise.race([
      ratelimit.limit(identifier),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Rate limit timeout')), 2000)
      )
    ]);
    
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          retryAfter: reset - Date.now(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(request);
    
    // Add rate limit headers to successful responses
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());
    
    return response;
  } catch (error) {
    console.error("Rate limit error:", error);
    
    // If rate limiting fails, still allow the request but log the error
    return handler(request);
  }
}