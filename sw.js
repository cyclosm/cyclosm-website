self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('sw-cache').then(function (cache) {
            return cache.add('index.html');
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function (error) {
            return caches.match(event.request);
        })
    );
});
