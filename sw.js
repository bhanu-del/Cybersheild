/**
 * CyberShield — Offline Service Worker (Cache-First)
 */
const CACHE_NAME = 'cybershield-cache-v31';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/modules.css',
  './css/responsive.css',
  './js/utils/icons.js',
  './js/utils/safe-rendering.js',
  './js/utils/ids.js',
  './js/utils/formatting.js',
  './js/utils/audio.js',
  './js/utils/certificate.js',
  './js/utils/cyber-hud.js',
  './js/utils/jsQR.js',
  './js/validation.js',
  './js/accessibility.js',
  './js/storage.js',
  './js/state.js',
  './data/rule-catalog.js',
  './data/scenarios.js',
  './data/lessons.js',
  './data/case-studies.js',
  './js/engine/url-parser.js',
  './js/engine/url-rules.js',
  './js/engine/message-rules.js',
  './js/engine/result-schema.js',
  './js/engine/evidence-aggregator.js',
  './js/engine/gemini-api.js',
  './js/modules/overview.js',
  './js/modules/chat.js',
  './js/modules/chat-widget.js',
  './js/modules/arena.js',
  './js/modules/link-inspector.js',
  './js/modules/message-analyzer.js',
  './js/modules/progress.js',
  './js/modules/learning-hub.js',
  './js/modules/academy.js',
  './js/modules/demo-mode.js',
  './js/modules/settings.js',
  './js/router.js',
  './js/app.js',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Always let server-side API calls go directly to the network
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamically if valid
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return caches.match('./index.html');
      });
    })
  );
});
