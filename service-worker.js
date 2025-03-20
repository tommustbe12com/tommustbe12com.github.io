self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/', 
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
      ]);
    })
  );
});

// activate service worker
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

// service worker fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// ill use this maybe sometime

// // function to show push notification
// function showPushNotification(title, options) {
//   self.registration.showNotification(title, options);
// }

// // push notification service worker
// self.addEventListener('push', function(event) {
//   const options = {
//     body: event.data ? event.data.text() : 'Default body',
//     icon: '/assets/profile.png',
//     badge: '/assets/badge.png'
//   };

//   event.waitUntil(
//     showPushNotification('Push Notification', options)
//   );
// });

// // notification click event
// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();

//   event.waitUntil(
//     clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
//       if (clientList.length > 0) {
//         let client = clientList[0];
//         return client.focus();
//       }
//       return clients.openWindow('/');
//     })
//   );
// });