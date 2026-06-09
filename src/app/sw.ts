import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.destination === "image",
      handler: new CacheFirst({
        cacheName: "dgitalcode-images",
        plugins: [],
      }),
    },
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.destination === "font",
      handler: new CacheFirst({
        cacheName: "dgitalcode-fonts",
        plugins: [],
      }),
    },
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin &&
        (request.destination === "document" ||
          request.mode === "navigate"),
      handler: new NetworkFirst({
        cacheName: "dgitalcode-pages",
        networkTimeoutSeconds: 8,
        plugins: [],
      }),
    },
    {
      matcher: ({ url, sameOrigin }) =>
        sameOrigin &&
        (url.pathname.startsWith("/fr") ||
          url.pathname.startsWith("/en") ||
          url.pathname.startsWith("/ar")),
      handler: new StaleWhileRevalidate({
        cacheName: "dgitalcode-locale-pages",
        plugins: [],
      }),
    },
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
