self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/', // Add the URLs you want to cache here
        '/index.html',
        '/style.css',
        '/script.js',
        '/assets/profile.png',
        '/soundtrack/album1/',
        '/soundtrack/album2/',
        '/soundtrack/album3/',
        '/server',
        '/blog/',
        '/amazon/',
        '/project-hub'
        // Add more URLs as needed
      ]);
    })
  );
});

// Service Worker Activation
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Remove any old caches here if needed
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Service Worker Fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});