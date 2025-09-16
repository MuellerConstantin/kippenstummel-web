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
      revision: "1",
    },
    {
      url: "/en/offline",
      revision: "1",
    },
    {
      url: "/images/logo.svg",
      revision: "1",
    },
  ],
});

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withSerwist(nextConfig));
