import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";
import regionSlugAliases from "./data/regions/de/aliases.json";

const isStandalone = process.env.NEXT_OUTPUT_MODE === "standalone";
const isProduction = process.env.NODE_ENV === "production";
const openFreeMapOrigin = "https://tiles.openfreemap.org";
const productionUmamiOrigin = "https://analytics.mueller-constantin.de";

function isHttpsUrl(url: string | undefined) {
  if (!url) {
    return false;
  }

  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

function toOrigin(url: string | undefined) {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/*
 * The CSP is fixed when the config is loaded, the Umami server is only read at
 * runtime. The production server is always allowed; a server already known at
 * this point, e.g. from a local env file, is allowed as well.
 */
const umamiOrigins = [
  ...new Set(
    [
      productionUmamiOrigin,
      toOrigin(process.env.NEXT_PUBLIC_UMAMI_SERVER),
    ].filter((origin): origin is string => origin !== null),
  ),
].join(" ");

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' ${umamiOrigins}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${openFreeMapOrigin}`,
  "font-src 'self' data:",
  `connect-src 'self' ${openFreeMapOrigin} ${umamiOrigins}`,
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

/**
 * Dialog routes only make sense as an overlay above the app. A hard visit gets
 * sent to the page the dialog belongs to instead of rendering nothing. Client
 * side navigations carry the RSC header and are left alone, so the intercepted
 * modal keeps working.
 */
const dialogFallbacks: Array<{ source: string; destination: string }> = [
  {
    source: "/:locale/dialog/map/:slug(help|settings)",
    destination: "/:locale/map",
  },
  {
    source: "/:locale/dialog/identity/:slug(new|import)",
    destination: "/:locale/home",
  },
  { source: "/:locale/dialog/identity", destination: "/:locale/home" },
];

const nextConfig: NextConfig = {
  output: isStandalone ? "standalone" : undefined,
  async redirects() {
    return [
      ...dialogFallbacks.map(({ source, destination }) => ({
        source,
        destination,
        missing: [{ type: "header" as const, key: "rsc" }],
        permanent: false,
      })),
      /*
       * Keeps region slugs reachable after they changed: once for the adjusted
       * slug logic, and again where a city had to be qualified to stay unique.
       */
      ...Object.entries(regionSlugAliases).map(([from, to]) => ({
        source: `/:locale/cvms/region/${from}`,
        destination: `/:locale/cvms/region/${to}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    const headers: Array<{ key: string; value: string }> = [
      {
        key: "Content-Security-Policy",
        value: csp,
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value:
          "geolocation=(self), camera=(), microphone=(), payment=(), usb=()",
      },
    ];

    if (isProduction && isHttpsUrl(process.env.NEXT_PUBLIC_SITE_URL)) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
  additionalPrecacheEntries: [
    {
      url: "/de/offline",
      revision: Date.now().toString(16),
    },
    {
      url: "/en/offline",
      revision: Date.now().toString(16),
    },
    {
      url: "/images/logo.svg",
      revision: Date.now().toString(16),
    },
  ],
});

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withSerwist(nextConfig));
