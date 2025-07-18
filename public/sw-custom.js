// Custom service worker additions for better offline support

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle fetch events for better offline support
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests when offline
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open('api-cache').then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // When offline, try to get from cache
          return caches.match(request).then(response => {
            if (response) {
              return response;
            }
            // Return a custom offline response for API calls
            return new Response(
              JSON.stringify({ 
                error: 'Offline', 
                message: 'Content not available offline' 
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'application/json'
                })
              }
            );
          });
        })
    );
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(request).then(response => {
            if (response) {
              return response;
            }
            // Try to return the cached home page
            return caches.match('/');
          });
        })
    );
    return;
  }
});

// Message handler for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});