import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkOnly,
  Serwist,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    concurrency: 10,
    ignoreURLParametersMatching: [],
  },
  fallbacks: {
    entries: [
      {
        url: "/de/offline",
        matcher: ({ request }) => {
          if (request.mode !== "navigate") return false;

          const url = new URL(request.url);
          const firstSegment = url.pathname.split("/").filter(Boolean)[0];
          return firstSegment !== "en";
        },
      },
      {
        url: "/en/offline",
        matcher: ({ request }) => {
          if (request.mode !== "navigate") return false;

          const url = new URL(request.url);
          const firstSegment = url.pathname.split("/").filter(Boolean)[0];
          return firstSegment === "en";
        },
      },
    ],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => url.hostname === "tiles.openfreemap.org",
      handler: new CacheFirst({
        cacheName: "ofm-assets",
        plugins: [
          new CacheableResponsePlugin({
            statuses: [200],
          }),
          new ExpirationPlugin({
            maxEntries: 5000,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    {
      matcher: /.*/i,
      handler: new NetworkOnly(),
    },
  ],
});

serwist.addEventListeners();
