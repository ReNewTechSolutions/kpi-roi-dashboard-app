// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // If you only want to protect /(protected) routes, do it by matcher (below)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect routes under /(protected)
    "/dashboard/:path*",
    "/metrics/:path*",
    "/org/:path*",
    "/roi/:path*",
    "/settings/:path*",
    "/legal/:path*",
  ],
};