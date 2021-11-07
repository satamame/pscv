var cacheName = 'pscv 1';

// キャッシュすべきファイルのリスト
var filesToCache = [
    '/pscv/',
    '/pscv/img/close.png',
    '/pscv/img/gear.png',
    '/pscv/img/list.png',
    '/pscv/index.html',
    '/pscv/scripts/app.js',
    '/pscv/scripts/back.js',
    '/pscv/styles/app.css',
    '/pscv/styles/psc.css',
];

// インストール時に発火するイベント
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// 起動時に発火するイベント
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
    .then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// リソースをリクエストされた時に発火するイベント
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetch(event.request);
    })
  );
});
