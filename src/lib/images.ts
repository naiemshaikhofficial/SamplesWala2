/**
 * Formats an image URL to use the Cloudflare Image Worker for optimization.
 * @param url Original image URL (Supabase storage or external)
 * @param width Optional width for optimization
 * @param quality Optional quality (1-100)
 */
export function getOptimizedImageUrl(url: string | null | undefined, width: number = 800, quality: number = 80): string {
  if (!url) return '/placeholder.jpg';
  return url;
}
