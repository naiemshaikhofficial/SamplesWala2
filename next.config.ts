import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        // Compiled NextJS Static bundles (JS/CSS)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
