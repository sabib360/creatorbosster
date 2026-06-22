/**
 * CreatorBoost AI — Enhanced Service Worker
 * Intelligent caching, offline support, and performance optimization
 *
 * Strategies:
 * - Cache-first for static assets (immutable)
 * - Stale-while-revalidate for API data
 * - Network-first for HTML pages
 * - Background sync for offline actions
 */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `creatorboost-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `creatorboost-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `creatorboost-images-${CACHE_VERSION}`;
const FONT_CACHE = `creatorboost-fonts-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
];

// ═══════════════════════════════════════════════════════════════════
// INSTALL
// ═══════════════════════════════════════════════════════════════════

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('Some static assets could not be cached');
      });
    })
  );
  self.skipWaiting();
});

// ═══════════════════════════════════════════════════════════════════
// ACTIVATE
// ═══════════════════════════════════════════════════════════════════

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key !== STATIC_CACHE &&
              key !== DYNAMIC_CACHE &&
              key !== IMAGE_CACHE &&
              key !== FONT_CACHE
          )
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ═══════════════════════════════════════════════════════════════════
// FETCH — Intelligent Routing
// ═══════════════════════════════════════════════════════════════════

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls, admin, and external resources
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    !url.origin.includes(self.location.hostname)
  ) {
    return;
  }

  // Fonts - cache first (long-lived)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Static assets - cache first (immutable)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images - cache first with network fallback
  if (isImage(url.pathname)) {
    event.respondWith(cacheFirstWithExpiry(request, IMAGE_CACHE, 7 * 24 * 60 * 60 * 1000));
    return;
  }

  // JavaScript/CSS bundles - stale while revalidate
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
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

// ═══════════════════════════════════════════════════════════════════
// CACHE STRATEGIES
// ═══════════════════════════════════════════════════════════════════

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

async function cacheFirstWithExpiry(request, cacheName, maxAge) {
  const cached = await caches.match(request);
  if (cached) {
    // Check if cache is still fresh
    const dateHeader = cached.headers.get('sw-cache-date');
    if (dateHeader) {
      const cacheDate = new Date(dateHeader).getTime();
      if (Date.now() - cacheDate < maxAge) return cached;
    } else {
      return cached;
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = response.clone();
      // Add cache date header
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      const modifiedResponse = new Response(await responseToCache.blob(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers,
      });
      cache.put(request, modifiedResponse);
    }
    return response;
  } catch {
    return cached || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(cacheName).then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
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

    if (request.headers.get('accept')?.includes('text/html')) {
      return (
        caches.match('/offline.html') ||
        new Response('Offline', {
          status: 503,
          headers: { 'Content-Type': 'text/html' },
        })
      );
    }

    return new Response('Offline', { status: 503 });
  }
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

function isStaticAsset(pathname) {
  return (
    pathname === '/' ||
    pathname === '/index.html' ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.svg'
  );
}

function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/i.test(pathname);
}

function isHTML(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// ═══════════════════════════════════════════════════════════════════
// BACKGROUND SYNC
// ═══════════════════════════════════════════════════════════════════

self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  console.log('Syncing contact form...');
}

// ═══════════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS (Future)
// ═══════════════════════════════════════════════════════════════════

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
