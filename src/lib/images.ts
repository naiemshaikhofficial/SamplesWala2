/**
 * Formats an image URL to use the Cloudflare Image Worker for optimization.
 * @param url Original image URL (Supabase storage or external)
 * @param width Optional width for optimization
 * @param quality Optional quality (1-100)
 */
export function getOptimizedImageUrl(url: string | null | undefined, width: number = 800, quality: number = 80): string {
  if (!url) return '/placeholder.jpg';

  const WORKER_URL = 'https://sampleswala-images.sampleswala.workers.dev';

  if (url.startsWith('/')) {
    return `${url}?w=${width}&q=${quality}`;
  }

  try {
    const isExternal = url.startsWith('http');
    if (!isExternal) return url;

    // Use the custom worker to resize and optimize
    return `${WORKER_URL}/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
  } catch (e) {
    return url;
  }
}
