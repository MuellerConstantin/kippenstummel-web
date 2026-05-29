import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*?page=", "/*?perPage=", "/*?shared="],
    },
    sitemap: "https://www.kippenstummel.de/sitemap.xml",
  };
}
