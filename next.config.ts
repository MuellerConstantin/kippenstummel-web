import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const isStandalone = process.env.NEXT_OUTPUT_MODE === "standalone";

const nextConfig: NextConfig = {
  output: isStandalone ? "standalone" : undefined,
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
