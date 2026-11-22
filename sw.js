/*!
 * SR Infinity Super App
 * © 2026 SR Infinity. All rights reserved.
 * This source code is proprietary. Do not copy, modify, distribute, sell or
 * use it to build a similar app without written permission. See LICENSE.
 */
/* SR Infinity service worker – network first, so new uploads reach users automatically.
   Offline: falls back to the last saved copy. */
const CACHE = "sr-infinity-offline";
const APP_FILES = ["./", "./index.html", "./styles.css", "./app.js", "./auth.js", "./manifest.webmanifest"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(APP_FILES.map(u =>
        fetch(u, { cache: "reload" }).then(r => r.ok && cache.put(u, r)).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request, url = new URL(req.url);
  // Only same-origin GET; version.json always goes straight to the network
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.endsWith("/version.json")) return;

  event.respondWith((async () => {
    try {
      const res = await fetch(req.url, { cache: "no-cache" });   // always revalidate with the server
      if (res.ok && res.type === "basic") {
        const cache = await caches.open(CACHE);
        cache.put(req.mode === "navigate" ? "./index.html" : req, res.clone());
      }
      return res;
    } catch (err) {
      const hit = await caches.match(req, { ignoreSearch: true }) ||
        (req.mode === "navigate" ? await caches.match("./index.html") : null);
      return hit || Response.error();
    }
  })());
});
