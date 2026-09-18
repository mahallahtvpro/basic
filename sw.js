// sw.js
const CACHE_NAME = 'mahallah-tv-v1';
const urlsToCache = [
    './',
    './index.html',
    './bootstrap.min.css',
    './bootstrap-icons.css',
    './bootstrap.bundle.min.js',
    './prayTimes.js',
    './hijri-calendar.js',
    './hariislam.js',
    './ayathadits.js',
    './screen-manager.js',
    './stb-compatibility.js',
    './stb-optimizer.js',
    './logo.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});