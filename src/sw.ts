import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

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
      matcher: /.*/i,
      handler: new NetworkOnly(),
    },
  ],
});

serwist.addEventListeners();
