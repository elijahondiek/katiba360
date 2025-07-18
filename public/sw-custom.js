// Custom service worker additions for better offline support

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing custom service worker');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating custom service worker');
  event.waitUntil(clients.claim());
});

// Handle fetch events for better offline support
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle localhost:8000 API requests (backend API)
  if (url.hostname === 'localhost' && url.port === '8000') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open('backend-api-cache').then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // When offline, try to get from cache
          return caches.match(request).then(response => {
            if (response) {
              console.log('[SW] Returning cached backend API response for:', url.pathname);
              return response;
            }
            // Return a custom offline response
            return new Response(
              JSON.stringify({ 
                error: 'Offline', 
                message: 'Backend API not available offline',
                cached: false
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

  // Handle Next.js API routes
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

  // Handle static files (manifest.json, images, etc.)
  if (url.pathname === '/manifest.json' || 
      url.pathname.endsWith('.png') || 
      url.pathname.endsWith('.jpg') || 
      url.pathname.endsWith('.svg')) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(response => {
          // Cache static files
          const responseToCache = response.clone();
          caches.open('static-assets').then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          // Return a 404 for missing static files when offline
          return new Response('Not Found', { status: 404 });
        });
      })
    );
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open('pages-cache').then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // When offline, try cache first
          return caches.match(request).then(response => {
            if (response) {
              console.log('[SW] Returning cached page for:', url.pathname);
              return response;
            }
            // Try to return the cached home page as fallback
            return caches.match('/').then(homeResponse => {
              if (homeResponse) {
                console.log('[SW] Returning cached home page as fallback');
                return homeResponse;
              }
              // Last resort: return offline page
              return new Response('Offline - Please check your connection', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/html'
                })
              });
            });
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