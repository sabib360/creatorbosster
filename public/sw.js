/**
 * Service Worker for CreatorBoost AI
 * Handles caching, offline support, and background sync.
 */

const CACHE_NAME = 'creatorboost-v1';
const STATIC_CACHE = 'creatorboost-static-v1';
const DYNAMIC_CACHE = 'creatorboost-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
];

const CACHE_STRATEGIES = {
  static: 'cache-first',
  dynamic: 'network-first',
  images: 'cache-first',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail for missing assets
        console.log('Some static assets could not be cached');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls and external resources
  if (url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/admin') ||
      !url.origin.includes(self.location.hostname)) {
    return;
  }

  // Static assets - cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images - cache first with network fallback
  if (isImage(url.pathname)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // HTML pages - network first with cache fallback
  if (isHTML(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Everything else - network first
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache strategies
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html') || new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname === '/' ||
    pathname === '/index.html' ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.svg';
}

function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname);
}

function isHTML(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Implementation for background sync
  console.log('Syncing contact form...');
}
