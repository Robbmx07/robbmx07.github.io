/* Keeps My Happy Place working with no internet. Bump VERSION when you upload a new index.html. */
var VERSION = 'mhp-1.1';
var FILES = ['./', 'index.html', 'icon-180.png', 'icon-512.png', 'manifest.json'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  /* use the saved copy first (instant, works offline); quietly fetch a fresh copy for next time */
  e.respondWith(caches.open(VERSION).then(function (c) { return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
    var net = fetch(e.request).then(function (r) { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(function () { return hit; });
    return hit || net;
  }); }));
});
