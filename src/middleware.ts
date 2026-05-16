import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Optimized Next.js Middleware for Samples Wala

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseResponse, user } = await updateSession(request)

  // 1. Redirect Dead/Removed Pages
// ... rest of redirects ...
  const deadLinks = ['/free', '/samples', '/vst-plugins', '/vocal-packs'];
  if (deadLinks.includes(pathname)) {
    return NextResponse.redirect(new URL('/browse/packs', request.url), 301);
  }

  // 2. Subdomain Routing Logic
  const hostname = request.headers.get('host') || '';
  const isDashboardSubdomain = hostname.startsWith('dashboard.');
  
  // Paths that should NEVER be rewritten to /dashboard
  const isSystemPath = 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/images') ||
    pathname.includes('.');

  if (isDashboardSubdomain) {
    // 1. System paths stay at the root
    if (isSystemPath) return supabaseResponse;
    
    // 2. Auth Check for Dashboard
    const isAuthPage = pathname.startsWith('/auth');

    if (!user && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // 3. Rewrite to /dashboard folder
    if (!pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone();
        url.pathname = `/dashboard${pathname === '/' ? '' : pathname}`;
        return NextResponse.rewrite(url);
    }
  }

  // 3. Finalize Response
  let response = supabaseResponse;

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
