import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const isStandalone = process.env.NEXT_OUTPUT_MODE === "standalone";
const isProduction = process.env.NODE_ENV === "production";
const openFreeMapOrigin = "https://tiles.openfreemap.org";

function toOrigin(url: string | undefined) {
  if (!url) {
    return undefined;
  }

  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

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

const ackeeOrigin = toOrigin(process.env.NEXT_PUBLIC_ACKEE_SERVER);

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
  `connect-src 'self' ${openFreeMapOrigin}${ackeeOrigin ? ` ${ackeeOrigin}` : ""}`,
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: isStandalone ? "standalone" : undefined,
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
