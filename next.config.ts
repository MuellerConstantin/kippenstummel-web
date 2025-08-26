import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa");

const isStandalone = process.env.NEXT_OUTPUT_MODE === "standalone";

const nextConfig: NextConfig = {
  output: isStandalone ? "standalone" : undefined,
};

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withPWAConfig(nextConfig));
