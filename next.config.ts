import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ALLOW DEV ORIGINS FOR HMR
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  // PERFORMANCE: Enable gzip compression to save Vercel bandwidth
  compress: true,

  // SECURITY: Hide X-Powered-By header
  poweredByHeader: false,

  images: {
    qualities: [75, 85],
    loader: 'custom',
    loaderFile: './src/lib/images/loader.ts',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.imageshack.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "zaocvqsslxopdchnxgbi.supabase.co",
      },
      {
        protocol: "https",
        hostname: "sampleswala-images.sampleswala.workers.dev",
      },
    ],
  },

  // CDN CACHING: Force browser/CDN caching for all local static assets to save Vercel transfer bytes
  async headers() {
    // 🟢 CPU OPTIMIZATION: Security headers & CSP moved here from middleware.
    // These are now computed once at build time, not on every request.
    const isDev = process.env.NODE_ENV === 'development';
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com https://challenges.cloudflare.com https://widget.trustpilot.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' https: data: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL || ''} wss://*.supabase.co https://*.supabase.co https://api.razorpay.com https://challenges.cloudflare.com`.trim(),
      "media-src 'self' blob: https:",
      "frame-src 'self' https://challenges.cloudflare.com https://widget.trustpilot.com https://www.youtube.com https://www.youtube-nocookie.com https://api.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ');

    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }]),
      { key: 'Content-Security-Policy', value: csp },
    ];

    return [
      {
        // Static local files (SVGs, PNGs, Icons, Fonts, Manifests)
        source: '/:path*.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|json)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // No-index API routes from search engines
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

export default nextConfig;
