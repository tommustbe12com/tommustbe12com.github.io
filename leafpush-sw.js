self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : {};
  var options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '',
    image: data.image || undefined,
    badge: data.badge || '',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: data.url ? [{ action: 'open', title: 'Open' }] : [],
    requireInteraction: true,
    tag: 'leafpush-' + Date.now()
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url === url && 'focus' in clientList[i]) return clientList[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});