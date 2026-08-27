import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/server/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*?page=", "/*?perPage=", "/*?shared="],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
