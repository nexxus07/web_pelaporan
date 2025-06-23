const CACHE_NAME = "pelaporan-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  "/icons/logo192.png",
  "/icons/logo512.png",
  "/static/js/bundle.js", // penting!
  "/static/js/main.chunk.js", // kalau pakai split
  "/static/js/0.chunk.js",
  "/static/css/main.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // agar langsung aktif
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return (
        res ||
        fetch(event.request).catch(
          () => caches.match("/index.html") // fallback untuk halaman
        )
      );
    })
  );
});
