import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const isStandalone = process.env.NEXT_OUTPUT_MODE === "standalone";
const isProduction = process.env.NODE_ENV === "production";
const openFreeMapOrigin = "https://tiles.openfreemap.org";
const ackeeOrigin = "https://ackee.kippenstummel.de";

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

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${openFreeMapOrigin}`,
  "font-src 'self' data:",
  `connect-src 'self' ${openFreeMapOrigin} ${ackeeOrigin}`,
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
    return dialogFallbacks.map(({ source, destination }) => ({
      source,
      destination,
      missing: [{ type: "header" as const, key: "rsc" }],
      permanent: false,
    }));
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
