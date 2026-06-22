import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ============================================================================
// RATE LIMITING CONFIGURATION (Edge-compatible, in-memory)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (per edge location)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMITS = {
  // General API routes: 100 requests per minute
  general: { maxRequests: 100, windowMs: 60 * 1000 },
  // Sensitive routes (payments, auth): 20 requests per minute
  sensitive: { maxRequests: 20, windowMs: 60 * 1000 },
};

// Sensitive route patterns that need stricter limits
const SENSITIVE_PATTERNS = [
  '/api/checkout',
  '/api/auth',
  '/api/download',
];

// Cleanup old entries every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanupRateLimitStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(ip: string, isSensitive: boolean): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupRateLimitStore();

  const config = isSensitive ? RATE_LIMITS.sensitive : RATE_LIMITS.general;
  const key = `${ip}:${isSensitive ? 'sensitive' : 'general'}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return { allowed: true, remaining: config.maxRequests - entry.count, resetIn: entry.resetTime - now };
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const proto = request.headers.get('x-forwarded-proto') || 'https'

  // 🟢 SEO & PERFORMANCE: Instant 301 Redirect for www and HTTP variants to enforce canonical HTTPS non-www domain
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  if (!isLocal && (host.startsWith('www.') || proto === 'http')) {
    const cleanHost = host.replace(/^www\./, '')
    const redirectUrl = new URL(pathname + request.nextUrl.search, `https://${cleanHost}`)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // 🟢 CPU OPTIMIZATION: Immediate redirect for dead pages to bypass expensive rate limiting or DB session checks.
  const deadLinks = ['/free', '/samples', '/vst-plugins', '/vocal-packs'];
  if (deadLinks.includes(pathname)) {
    return NextResponse.redirect(new URL('/browse/packs', request.url), 301);
  }

  // 1. IP & API/Action Rate Limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    '127.0.0.1';

  const isApi = pathname.startsWith("/api");
  const isServerAction = request.headers.has('next-action') || request.method === 'POST';

  if (isApi || isServerAction) {
    // Server actions are treated as sensitive operations (e.g. cart modifications, auth, forms)
    const isSensitive = isServerAction || SENSITIVE_PATTERNS.some(pattern => pathname.startsWith(pattern));
    const rateLimit = checkRateLimit(ip, isSensitive);

    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later."
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString(),
            "X-RateLimit-Limit": (isSensitive ? RATE_LIMITS.sensitive.maxRequests : RATE_LIMITS.general.maxRequests).toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(rateLimit.resetIn / 1000).toString()
          }
        }
      );
    }
  }

  // 2. Bot Scraper Protection (Allow search engines & Lighthouse for audits)
  const ua = request.headers.get("user-agent") || "";
  const isSuspicious = /bot|spider|crawl|scraper|curl|wget|python|libwww|headless/i.test(ua) &&
    !/googlebot|bingbot|yandexbot|duckduckbot|lighthouse/i.test(ua);

  if (!isLocal && isSuspicious && (isApi || isServerAction)) {
    return new NextResponse(
      JSON.stringify({ error: "Access Denied: Automated tools are blocked." }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // 3. Supabase Session Sync
  const { supabaseResponse, user } = await updateSession(request)

  // 4. Return response
  // 🟢 CPU OPTIMIZATION: Security headers & CSP are now handled by next.config.ts headers()
  // instead of being computed here on every request. This saves ~10-30ms per request.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/assets (svg, png, etc, including all other common static assets like woff, json, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|mp3|wav|pdf|json|txt|webmanifest)$).*)',
  ],
}
