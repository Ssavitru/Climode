import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, allowing 20 requests per minute
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  try {
    // Get client IP or fallback to a default
    const ip = request.ip ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
    const identifier = `${request.method}_${request.nextUrl.pathname}_${ip}`;
    
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      identifier
    );
    
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
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
