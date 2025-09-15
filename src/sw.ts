import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  CacheFirst,
  ExpirationPlugin,
  StaleWhileRevalidate,
  NetworkFirst,
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
      matcher: ({ request, url: { pathname }, sameOrigin }) =>
        sameOrigin &&
        request.mode === "navigate" &&
        !pathname.startsWith("/api/") &&
        !pathname.startsWith("/_next/"),
      handler: new StaleWhileRevalidate({
        cacheName: "pages",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60, // 24 Stunden
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\/_next\/static.+\.js$/i,
      handler: new CacheFirst({
        cacheName: "next-scripts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\/_next\/image\?url=.+$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "next-images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\/_next\/data\/.+\/.+\.json$/i,
      handler: new NetworkFirst({
        cacheName: "next-data",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: ({ request, url: { pathname }, sameOrigin }) =>
        request.headers.get("RSC") === "1" &&
        request.headers.get("Next-Router-Prefetch") === "1" &&
        sameOrigin &&
        !pathname.startsWith("/api/"),
      handler: new NetworkFirst({
        cacheName: "rsc-prefetch",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: ({ request, url: { pathname }, sameOrigin }) =>
        request.headers.get("RSC") === "1" &&
        sameOrigin &&
        !pathname.startsWith("/api/"),
      handler: new NetworkFirst({
        cacheName: "rsc",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:js)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "scripts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 48,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:css|less)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "styles",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "fonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 4,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: ({ request }) => request.url.endsWith(".pbf"),
      handler: new CacheFirst({
        cacheName: "tiles",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 1000,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
    {
      matcher: ({ sameOrigin, url: { pathname } }) =>
        sameOrigin && /^\/api(?!\/bff\/cvms)(?:\/.*)?$/i.test(pathname),
      method: "GET",
      handler: new NetworkFirst({
        cacheName: "apis",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
            maxAgeFrom: "last-used",
          }),
        ],
        networkTimeoutSeconds: 10,
      }),
    },
    {
      matcher: ({ sameOrigin, url: { pathname } }) =>
        sameOrigin && /^\/api\/bff\/cvms(?:\/.*)?$/i.test(pathname),
      method: "GET",
      handler: new StaleWhileRevalidate({
        cacheName: "cvms",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
            maxAgeFrom: "last-used",
          }),
        ],
      }),
    },
  ],
});

serwist.addEventListeners();
