var cacheName = 'pscv 0.0.1';

// キャッシュすべきファイルのリスト
var filesToCache = [
    '/pscv/',
    '/pscv/img/close.png',
    '/pscv/img/gear.png',
    '/pscv/img/list.png',
    '/pscv/index.html',
    '/pscv/scripts/app.js',
    '/pscv/scripts/back.js',
    '/pscv/scripts/psc.js',
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
  // リクエスト URL からオリジンを取り除いて、キャッシュすべきか判断する
  const regex = /^https?:\/\/[^/]+/;
  const url = event.request.url.replace(regex, '');

  // TODO: 削除すること (デバッグ用)
  // console.log(`*** url: ${url}`);
  // caches.match(event.request).then(response => {
  //   console.log(`*** cache: ${response}`);
  // });

  // キャッシュされるファイルなら、キャッシュを優先する
  if (filesToCache.includes(url)) {
    event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        // キャッシュがあればそれを返し、なければリクエストする
        return response || fetch(event.request).then((response) => {
          // リクエストで得られたレスポンスをキャッシュする
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  // キャッシュされないファイルなら、普通にリクエストする
  } else {
    event.respondWith(fetch(event.request));
  }
});
