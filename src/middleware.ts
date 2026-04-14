import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect authenticated routes on the server side.
 * This prevents unauthenticated users from accessing sensitive pages 
 * and avoids "content flashes" by redirecting before the page renders.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('raver_token')?.value;
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const isPublicRoute = pathname === '/' || pathname === '/signup' || pathname.startsWith('/landing');
  
  // Define asset routes and internal Next.js routes
  const isInternalRoute = 
    pathname.startsWith('/_next') || 
    pathname.includes('/assets/') || 
    pathname.includes('/public/') ||
    pathname === '/favicon.ico';

  // 1. If trying to access a protected route without a token -> Redirect to login (/)
  if (!token && !isPublicRoute && !isInternalRoute) {
    const loginUrl = new URL('/', request.url);
    // Optionally preserve the attempted URL to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access the login page while already authenticated -> Redirect to /home
  if (token && isPublicRoute && pathname !== '/signup') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

/**
 * Configure matching paths for the middleware.
 * We exclude /api routes as they handle their own 401 responses.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
