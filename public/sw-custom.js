// Custom service worker additions for better offline support

// Import configuration
self.importScripts('/sw-config.js');

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing custom service worker');
  console.log('[SW] API URL:', self.SW_CONFIG?.API_URL);
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

  // Handle POST requests to backend API
  if (request.method === 'POST') {
    const apiUrl = self.SW_CONFIG?.API_URL || 'http://localhost:8000';
    if (url.href.startsWith(apiUrl)) {
      event.respondWith(
        fetch(request).catch(() => {
          return new Response(
            JSON.stringify({ 
              error: 'Offline', 
              message: 'Cannot process POST requests while offline'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
      );
      return;
    }
  }

  // Skip other non-GET requests
  if (request.method !== 'GET') return;

  // Handle Vercel Analytics gracefully when offline
  if (url.pathname.includes('/_vercel/') || url.pathname.includes('/vitals')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return empty response for analytics when offline
        return new Response('', { status: 204 });
      })
    );
    return;
  }

  // Handle backend API requests dynamically using config
  const apiUrl = self.SW_CONFIG?.API_URL || 'http://localhost:8000';
  const apiUrlObj = new URL(apiUrl);
  
  // Check if it's a backend API request (including production URLs)
  const isBackendAPI = url.href.includes('/api/v1/') || 
                       (url.hostname === apiUrlObj.hostname && url.port === apiUrlObj.port) ||
                       url.href.startsWith(apiUrl) ||
                       url.hostname.includes('katiba360-backend') ||
                       url.hostname.includes('onrender.com');
  
  if (isBackendAPI) {
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
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.ico')) {
    event.respondWith(
      caches.open('static-assets').then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            console.log('[SW] Returning cached static asset:', url.pathname);
            return response;
          }
          
          // Try to fetch and cache
          return fetch(request).then(fetchResponse => {
            // Cache static files
            if (fetchResponse.status === 200) {
              const responseToCache = fetchResponse.clone();
              cache.put(request, responseToCache);
            }
            return fetchResponse;
          }).catch(() => {
            console.log('[SW] Failed to fetch static asset:', url.pathname);
            // For manifest.json, return a minimal valid manifest
            if (url.pathname === '/manifest.json') {
              return new Response(JSON.stringify({
                name: 'Katiba360',
                short_name: 'Katiba360',
                start_url: '/',
                display: 'standalone'
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            return new Response('Not Found', { status: 404 });
          });
        });
      })
    );
    return;
  }

  // Handle RSC requests (Next.js specific)
  if (url.searchParams.has('_rsc')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return empty RSC response when offline
        return new Response('0:["$","div",null,{"children":"Offline"}]', {
          status: 200,
          headers: {
            'Content-Type': 'text/x-component',
            'x-offline': 'true'
          }
        });
      })
    );
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
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