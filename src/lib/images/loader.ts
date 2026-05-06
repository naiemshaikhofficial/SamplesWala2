/**
 * 🛰️ CLOUDFLARE_IMAGE_OPTIMIZER_LOADER
 * Bypasses Vercel's Image Optimization to save data transfer.
 * Redirects all image requests to the Unified Cloudflare Worker.
 */
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('/')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  return src;
}
