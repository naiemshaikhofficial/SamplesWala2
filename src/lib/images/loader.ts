/**
 * 🛰️ CLOUDFLARE_IMAGE_OPTIMIZER_LOADER
 * Bypasses Vercel's Image Optimization to save data transfer.
 * Redirects all image requests to the Unified Cloudflare Worker.
 */
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const WORKER_URL = process.env.NEXT_PUBLIC_IMAGE_WORKER_URL || 'https://sampleswala-images.sampleswala.workers.dev';
  
  if (src.startsWith('/')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  // 🌩️ Optimized Cloudflare Worker Pattern
  // This pattern handles both direct proxying and resizing
  try {
    const isExternal = src.startsWith('http');
    if (!isExternal) return src;

    // Use the custom worker to resize and optimize
    // We use a query-based approach as it's the most compatible for custom workers
    return `${WORKER_URL}/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  } catch (e) {
    return src;
  }
}
