const CACHE_NAME = "pelaporan-cache-v4"; // Ganti v2 ke v3, dst jika ada update
const urlsToPreCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  "/icons/logo192.png",
  "/icons/logo512.png",
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToPreCache))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch - hybrid strategy
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // ❗ Abaikan permintaan ke domain luar seperti apis.google.com
  if (!url.origin.includes(location.origin)) {
    return; // jangan ganggu, biarkan browser langsung ambil dari jaringan
  }

  // Cache untuk file statis lokal (.js, .css, .png, .chunk.js, dll)
  if (
    /\.(js|css|png|svg|woff2?|chunk\.js)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request)
            .then((response) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
                return response;
              });
            })
            .catch(() => caches.match("/index.html"))
        );
      })
    );
    return;
  }

  // Default: Cache First, Fallback ke jaringan
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).catch(() => caches.match("/index.html"));
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
