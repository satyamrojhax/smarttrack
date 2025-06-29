
const CACHE_NAME = 'axiom-smart-track-v2';
const DYNAMIC_CACHE = 'axiom-dynamic-v1';

// Critical resources to cache immediately
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching critical resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        // Force activation of new service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other protocols
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // For HTML pages, also check for updates in background
          if (request.headers.get('accept')?.includes('text/html')) {
            updateCacheInBackground(request);
          }
          return cachedResponse;
        }

        // Fetch from network and cache dynamically
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseToCache = response.clone();
              
              // Cache static assets more aggressively
              if (isStaticAsset(request.url)) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseToCache);
                });
              } else {
                // Cache other resources in dynamic cache
                caches.open(DYNAMIC_CACHE).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
            }
            
            return response;
          })
          .catch((error) => {
            console.log('Service Worker: Fetch failed:', error);
            // Return offline fallback for HTML pages
            if (request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/');
            }
            throw error;
          });
      })
  );
});

// Helper function to update cache in background
function updateCacheInBackground(request) {
  fetch(request)
    .then((response) => {
      if (response.status === 200) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
    })
    .catch(() => {
      // Silently fail background updates
    });
}

// Helper function to identify static assets
function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/i.test(url);
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Implement background sync logic here if needed
      Promise.resolve()
    );
  }
});

// Push notifications support (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/manifest.json',
      badge: '/manifest.json',
      tag: 'axiom-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
