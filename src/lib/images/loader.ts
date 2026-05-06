/**
 * 🛰️ CLOUDFLARE_IMAGE_OPTIMIZER_LOADER
 * Bypasses Vercel's Image Optimization to save data transfer.
 * Returns external URLs directly to avoid broken images if the worker is unavailable.
 */
export default function cloudflareLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('/')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  // Return original URL for external images to ensure they show up
  // This still saves Vercel Image Optimization costs as it bypasses their proxy
  return src;
}
