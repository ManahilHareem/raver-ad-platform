import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('raver_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const isPublicRoute = pathname === '/' || pathname === '/signup' || pathname === '/landing' || pathname.startsWith('/_next') || pathname === '/favicon.ico';

  if (!token && !isPublicRoute) {
    // Redirect to login if no token is found and trying to access a protected route
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && (pathname === '/' || pathname === '/signup')) {
    // Redirect to home if already logged in and trying to access login/signup
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/home/:path*', '/studio/:path*', '/settings/:path*'],
};
