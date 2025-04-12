import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Get token from cookie
  const token = request.cookies.get('token')?.value;
  
  // If the path is public and user is logged in, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If the path is not public and user is not logged in, redirect to login
  if (!isPublicPath && !token && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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