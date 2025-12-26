import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Don't check auth for login page or API auth routes
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only"
  });

  // Only protect API routes and app routes, not login or home
  if (
    !token &&
    (request.nextUrl.pathname.startsWith("/api/bast") ||
      request.nextUrl.pathname.startsWith("/api/contract") ||
      request.nextUrl.pathname.startsWith("/bast") ||
      request.nextUrl.pathname.startsWith("/contract"))
  ) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/bast/:path*",
    "/contract/:path*",
    "/api/bast/:path*",
    "/api/contract/:path*",
  ],
};

