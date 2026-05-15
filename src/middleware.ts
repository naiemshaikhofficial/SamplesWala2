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

  // 2. Performance Optimization: Only update session for critical routes
  // This drastically reduces Supabase API calls and improves latency for public pages
  const isCriticalRoute = 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/auth/') || 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/library') ||
    pathname.startsWith('/account') ||
    request.cookies.has('sb-access-token'); // If they have a session cookie, refresh it

  let response = NextResponse.next({
    request,
  })

  if (isCriticalRoute) {
    response = await updateSession(request)
  }

  // 3. Security Headers
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
