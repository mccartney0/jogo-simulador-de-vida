import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

clientsClaim();
cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate()
);

registerRoute(({ request }) => request.mode === 'navigate', async ({ event }) => {
  const cache = await caches.open('life-sim-shell');
  const cached = await cache.match('/index.html');
  if (cached) {
    return cached;
  }
  return fetch(event.request);
});
