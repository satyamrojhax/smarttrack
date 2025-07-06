
const CACHE_NAME = 'axiom-smart-track-v4';
const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v4';

// Enhanced caching strategy for production
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  // Cache offline fallback page
  '/offline.html',
];

// Install event - aggressive caching for production
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v4...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('[SW] Pre-caching dynamic resources');
        return cache.addAll([
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        ]);
      })
    ]).then(() => {
      console.log('[SW] Installation complete, taking control');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up and take control
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v4...');
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete - ready for production');
    })
  );
});

// Production-ready fetch strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  const url = new URL(event.request.url);

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match('/') || caches.match('/offline.html');
        })
    );
    return;
  }

  // API calls - network first with timeout
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase') || url.hostname.includes('googleapis')) {
    event.respondWith(networkFirstWithTimeout(event.request));
    return;
  }

  // Static assets - cache first
  if (event.request.destination === 'image' || 
      event.request.destination === 'font' || 
      event.request.destination === 'style' ||
      event.request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }

  // Everything else - stale while revalidate
  event.respondWith(staleWhileRevalidateStrategy(event.request));
});

// Network first with timeout for critical requests
async function networkFirstWithTimeout(request) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const networkResponse = await fetch(request, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network timeout/error, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response(
      JSON.stringify({ error: 'Service temporarily unavailable' }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache first for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, response);
        });
      }
    }).catch(() => {});
    
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch asset:', request.url);
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Stale while revalidate for general requests
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  const networkFetch = fetch(request).then(response => {
    if (response.ok) {
      caches.open(DYNAMIC_CACHE).then(cache => {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(() => cachedResponse);

  return cachedResponse || networkFetch;
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('[SW] Performing background sync...');
  try {
    // Sync offline data when back online
    const offlineData = await getOfflineData();
    if (offlineData && offlineData.length > 0) {
      await syncDataToServer(offlineData);
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

async function getOfflineData() {
  // Get offline data from IndexedDB or localStorage
  return [];
}

async function syncDataToServer(data) {
  // Sync data to server
  console.log('[SW] Syncing data to server:', data.length, 'items');
}

// Enhanced push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || 1,
        url: data.url || '/'
      },
      actions: [
        {
          action: 'open', 
          title: 'Open App',
          icon: '/favicon.ico'
        },
        {
          action: 'dismiss', 
          title: 'Dismiss',
          icon: '/favicon.ico'
        },
      ],
      requireInteraction: false,
      silent: false,
      tag: 'axiom-notification'
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Axiom Smart Track', 
        options
      )
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received.');
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = Date.now();
  
  event.respondWith(
    handleRequest(event.request).then(response => {
      const duration = Date.now() - startTime;
      
      // Log slow requests
      if (duration > 5000) {
        console.warn(`[SW] Slow request detected: ${event.request.url} took ${duration}ms`);
      }
      
      return response;
    })
  );
});

async function handleRequest(request) {
  return fetch(request);
}
