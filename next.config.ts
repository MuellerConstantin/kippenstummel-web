import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isStandalone = process.env.NEXT_OUTPUT_MODE === "standalone";

const nextConfig: NextConfig = {
  output: isStandalone ? "standalone" : undefined,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
