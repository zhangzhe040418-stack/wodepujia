const CACHE_NAME = "my-score-folder-v43";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=43",
  "./app.js?v=43",
  "./vendor/lucide.min.js?v=43",
  "./cloudbase-config.js?v=43",
  "./manifest.webmanifest?v=43",
  "./assets/add-score-button.png?v=43",
  "./icons/icon-192.png?v=43",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html")),
    );
    return;
  }

  const isAppFile = APP_SHELL.some((url) => new URL(url, self.location.href).href === request.url);

  event.respondWith(
    fetch(request)
      .then((response) => {
        const sameOrigin = new URL(request.url).origin === self.location.origin;

        if ((sameOrigin || isAppFile) && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }

        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          throw new Error(`No cached response for ${request.url}`);
        });
      }),
  );
});
