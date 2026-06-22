import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js middleware for route protection.
 *
 * Checks for the orean360_token in cookies.
 * Note: The token is stored in localStorage on the client,
 * so this middleware primarily handles server-side redirects.
 * Client-side protection is handled by the root page.tsx redirect logic.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require auth
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/_next")
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For API routes, let them pass through (backend handles auth)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check for auth token in cookies (set by client after login)
  const token = request.cookies.get("orean360_token")?.value;

  // If no cookie token, we still allow the request through
  // because the client-side auth check in page.tsx handles localStorage-based auth.
  // This middleware is for defense-in-depth when cookies are used.
  if (!token && pathname.startsWith("/dashboard")) {
    // Instead of hard-blocking, we let the client-side handle the redirect
    // This prevents SSR issues with localStorage-based auth
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
