/**
 * 🛰️ CLOUDFLARE_IMAGE_OPTIMIZER_LOADER
 * Bypasses Vercel's Image Optimization to save data transfer.
 * Redirects all image requests to the Unified Cloudflare Worker.
 */
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const WORKER_URL = 'https://sampleswala-images.naiem-shaikh.workers.dev';
  
  if (src.startsWith('/')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  // Optimize external images via Cloudflare Worker
  return `${WORKER_URL}?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
