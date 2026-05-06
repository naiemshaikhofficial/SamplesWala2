import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
