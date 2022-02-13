const cacheName = 'pscv 0.0.1';
const debug = true;

// キャッシュ対象ファイル
const filesToCache = [
    '/pscv/',
    '/pscv/img/close.png',
    '/pscv/img/gear.png',
    '/pscv/img/list.png',
    '/pscv/img/magnifier.png',
    '/pscv/index.html',
    '/pscv/scripts/app.js',
    '/pscv/scripts/back.js',
    '/pscv/scripts/init.js',
    '/pscv/scripts/psc.js',
    '/pscv/styles/app.css',
    '/pscv/styles/psc.css',
];

// インストール時に発火するイベント
self.addEventListener('install', function(event) {
  event.waitUntil(
    // キャッシュ対象ファイルを事前読込みする
    caches.open(cacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// 起動時に発火するイベント
self.addEventListener('activate', function(event) {
  event.waitUntil(
    // キャッシュ名の異なるキャッシュを削除する
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

  if (debug) console.log(`*** Requested url: ${url}`);

  // キャッシュ対象ファイルなら、キャッシュを優先する
  if (filesToCache.includes(url)) {
    if (debug) console.log('*** to be cached.');
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
  // キャッシュ対象ファイルでなければ、普通にリクエストする
  } else {
    if (debug) console.log('*** NOT to be cached.');
    event.respondWith(fetch(event.request));
  }
});
