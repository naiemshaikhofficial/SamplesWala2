/**
 * 🛰️ CLOUDFLARE_IMAGE_OPTIMIZER_LOADER
 * Bypasses Vercel's Image Optimization to save data transfer.
 * Redirects all image requests to the Unified Cloudflare Worker.
 */
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Use the correct worker URL provided by the user
  const WORKER_URL = 'https://sampleswala-images.sampleswala.workers.dev';
  
  if (src.startsWith(WORKER_URL)) {
    try {
      const urlObj = new URL(src);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', (quality || 75).toString());
      return urlObj.toString();
    } catch (e) {
      return src;
    }
  }

  if (src.startsWith('/')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }




  // 🌩️ Optimized Cloudflare Worker Pattern
  try {
    const isExternal = src.startsWith('http');
    if (!isExternal) return src;

    // Use the custom worker to resize and optimize
    return `${WORKER_URL}/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  } catch (e) {
    return src;
  }
}

