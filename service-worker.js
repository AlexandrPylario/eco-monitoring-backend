const CACHE_NAME = 'eco-monitoring-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Кешування під час встановлення
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ SW: Кешуємо ресурси');
      return cache.addAll(urlsToCache);
    })
  );
});

// Перехоплення запитів — кеш або мережа
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Видалення старих кешів
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ SW: Видаляємо старий кеш:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

