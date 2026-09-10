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
// ============================================================================
// SITE STATUS & MAINTENANCE RESOLVER (Edge-compatible, 5s in-memory cache)
// ============================================================================

interface CachedSiteStatus {
  maintenance: boolean;
  readOnly: boolean;
  storeEnabled: boolean;
  expires: number;
}

let siteStatusCache: CachedSiteStatus = { maintenance: false, readOnly: false, storeEnabled: true, expires: 0 };

async function getSiteStatus(): Promise<CachedSiteStatus> {
  const now = Date.now();
  if (now < siteStatusCache.expires) {
    return siteStatusCache;
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) return siteStatusCache;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(
      `${supabaseUrl}/rest/v1/app_metadata?key=in.(maintenance_mode,site_settings)&select=key,value`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
        signal: controller.signal,
        cache: 'no-store'
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const rows = await res.json();
      let isMaintenance = false;
      let isReadOnly = false;
      let isStoreEnabled = true;

      for (const row of rows) {
        if (row.key === 'maintenance_mode') {
          isMaintenance = row.value === 'true';
        } else if (row.key === 'site_settings') {
          try {
            const parsed = JSON.parse(row.value);
            if (parsed.maintenance_mode !== undefined) isMaintenance = Boolean(parsed.maintenance_mode);
            if (parsed.read_only_mode !== undefined) isReadOnly = Boolean(parsed.read_only_mode);
            if (parsed.store_enabled !== undefined) isStoreEnabled = Boolean(parsed.store_enabled);
          } catch {}
        }
      }

      siteStatusCache = {
        maintenance: isMaintenance,
        readOnly: isReadOnly,
        storeEnabled: isStoreEnabled,
        expires: now + 5000
      };
      return siteStatusCache;
    }
  } catch {
    siteStatusCache.expires = now + 5000;
  }
  return siteStatusCache;
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
  const deadLinks = ['/samples', '/vst-plugins', '/vocal-packs'];
  if (deadLinks.includes(pathname)) {
    return NextResponse.redirect(new URL('/browse/packs', request.url), 301);
  }

  // 🟢 MAINTENANCE MODE REDIRECTION:
  // Redirect /maintance to /maintenance
  if (pathname === '/maintance') {
    return NextResponse.redirect(new URL('/maintenance', request.url), 307);
  }

  const siteStatus = await getSiteStatus();
  const isMaintenance = siteStatus.maintenance;
  const isMaintenancePage = pathname === '/maintenance';
  const hasPreviewParam = request.nextUrl.searchParams.get('preview') === '1';
  const hasAdminBypass =
    request.cookies.has('sampleswala_admin_bypass') ||
    request.nextUrl.searchParams.get('bypass') === 'sampleswala_admin';

  if (isMaintenance && !hasAdminBypass) {
    // If maintenance is ON and user is NOT on /maintenance and NOT calling revalidation API:
    if (!isMaintenancePage && !pathname.startsWith('/api/revalidate')) {
      return NextResponse.redirect(new URL('/maintenance', request.url), 307);
    }
  } else if (!isMaintenance && isMaintenancePage && !hasPreviewParam) {
    // If maintenance is OFF, and user visits /maintenance directly without preview, return to home:
    return NextResponse.redirect(new URL('/', request.url), 307);
  }

  // 🟢 READ-ONLY OR STORE PAUSED PROTECTION:
  if ((siteStatus.readOnly || !siteStatus.storeEnabled) && !hasAdminBypass) {
    if (pathname === '/checkout' || pathname.startsWith('/checkout/')) {
      return NextResponse.redirect(new URL('/browse/packs?notice=checkout_paused', request.url), 307);
    }
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
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|eot|mp3|wav|ogg|pdf|json|txt|webmanifest)$).*)',
  ],
}
