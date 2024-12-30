import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = request.nextUrl.pathname;

  // If it's the root path, allow it
  if (path === "/") {
    return NextResponse.next();
  }

  // If it's an API route, allow it
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  // If it's an asset or image, allow it
  if (path.startsWith("/_next") || path.includes(".")) {
    return NextResponse.next();
  }

  // Redirect all other routes to the homepage
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/:path*",
};
