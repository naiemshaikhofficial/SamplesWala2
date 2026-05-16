import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Optimized Next.js Middleware for Samples Wala

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Redirect Dead/Removed Pages
  const deadLinks = ['/free', '/samples', '/vst-plugins', '/vocal-packs'];
  if (deadLinks.includes(pathname)) {
    return NextResponse.redirect(new URL('/browse/packs', request.url), 301);
  }

  // 2. Subdomain Routing Logic
  const hostname = request.headers.get('host') || '';
  const isDashboardSubdomain = hostname.startsWith('dashboard.');
  
  // Paths that should ALWAYS be served from the root (not rewritten)
  const isReservedPath = 
    pathname.startsWith('/auth') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/images') ||
    pathname.includes('.');

  if (isDashboardSubdomain) {
    // 1. If it's a system/auth path, DO NOT rewrite at all. Just let it through.
    if (isReservedPath) {
        return NextResponse.next();
    }
    
    // 2. Rewrite everything else to the /dashboard folder
    if (!pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone();
        url.pathname = `/dashboard${pathname === '/' ? '' : pathname}`;
        return NextResponse.rewrite(url);
    }
  }

  // 3. Performance Optimization: Only update session for critical routes
  const isCriticalRoute = 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/auth/') || 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/library') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/dashboard') ||
    isDashboardSubdomain ||
    request.cookies.has('sb-access-token');

  let response = NextResponse.next({
    request,
  })

  if (isCriticalRoute) {
    response = await updateSession(request)
  }

  // 4. Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/assets (svg, png, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
