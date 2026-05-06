/**
 * 🛰️ CLOUDFLARE_IMAGE_OPTIMIZER_LOADER
 * Bypasses Vercel's Image Optimization to save data transfer.
 * Redirects all image requests to the Unified Cloudflare Worker.
 */
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Use the correct worker URL provided by the user
  const WORKER_URL = 'https://sampleswala-images.sampleswala.workers.dev';
  
  if (src.startsWith('/')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  // 🌩️ Optimized Cloudflare Worker Pattern
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
