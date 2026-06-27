const CACHE_NAME = "my-score-folder-v237";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=216",
  "./piano.css?v=216",
  "./piano.js?v=216",
  "./app.js?v=221",
  "./vendor/lucide.min.js?v=47",
  "./cloudbase-config.js?v=47",
  "./manifest.webmanifest?v=71",
  "./assets/add-score-button.png?v=51",
  "./icons/icon-192.png?v=50",
  "./icons/icon-512.png?v=50",
  "./icons/maskable-512.png?v=50",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await Promise.allSettled(
          APP_SHELL.map(async (url) => {
            try {
              const response = await fetch(url, { cache: "reload" });
              if (response && response.ok) {
                await cache.put(url, response);
              }
            } catch (error) {
              console.warn("[sw] install cache skipped:", url, error);
            }
          }),
        );

        if (!(await cache.match("./index.html"))) {
          try {
            const response = await fetch("./index.html", { cache: "reload" });
            if (response && response.ok) {
              await cache.put("./index.html", response);
            }
          } catch (error) {
            console.warn("[sw] index fallback cache failed:", error);
          }
        }
      })
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
