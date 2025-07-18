import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/auth/callback',
  '/auth/google',
  '/api/auth/google/callback',
  '/api/v1/auth/logout',
  '/chapters',
  '/scenarios',
  '/search',
  '/rights',
  '/onboarding',
  '/about',
  '/about/mission',
  '/about/team',
  '/about/partners',
  '/about/contact',
  '/privacy',
  '/terms',
];

// Check if the path is public
const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some(publicPath => 
    path === publicPath || 
    path.startsWith(publicPath + '/')
  );
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow requests for static files and PWA files
  if (pathname.match(/\.(?:png|jpg|jpeg|svg|gif|ico|webp|css|js|txt|woff2?|ttf|json)$/i) || 
      pathname === '/manifest.json' || 
      pathname === '/sw.js' ||
      pathname.startsWith('/workbox-')) {
    return NextResponse.next();
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication token
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Check if token is valid (not undefined or null string)
  const hasValidToken = accessToken && accessToken !== 'undefined' && accessToken !== 'null';
  
  // If no valid token is found, redirect to login
  if (!hasValidToken) {
    const loginUrl = new URL('/login', request.url);
    
    // Add the original URL as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth/* (API routes that handle authentication)
     * 2. /_next/* (Next.js internal routes)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /robots.txt (common static files)
     */
    '/((?!_next/|static/|favicon.ico|robots.txt).*)',
  ],
};
