const CACHE_NAME = 'sampleswala-images-v1';
const IMAGE_WORKER_DOMAIN = 'sampleswala-images.sampleswala.workers.dev';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch interception is disabled to let the browser's native HTTP cache
// handle caching via 'Cache-Control: public, max-age=31536000, immutable' headers.
// This prevents cross-origin CORS/opaque load failures (net::ERR_FAILED) in the Service Worker context.
/*
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept requests to our image worker
  if (url.hostname === IMAGE_WORKER_DOMAIN) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
            return response;
          }

          // Clone the response to store it in cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
  }
});
*/
