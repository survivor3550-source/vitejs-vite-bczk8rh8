const CACHE_NAME = 'conferia-cache-v1';
const OFFLINE_URL = '/index.html';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            try { cache.put(request, response.clone()); } catch (e) {}
            return response;
          });
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});
