import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/signup', '/landing', '/favicon.ico'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('raver_token')?.value;
  const { pathname } = request.nextUrl;

  // Check if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith('/_next') || pathname.startsWith('/assets')
  );

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

// Ensure middleware runs on all routes except static files and special Next.js paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)'],
};
