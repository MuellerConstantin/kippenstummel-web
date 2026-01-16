import type { MetadataRoute } from "next";
import { REGIONS } from "@/lib/regions";

const BASE_URL = "https://kippenstummel.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/home`,
      lastModified: new Date(),
      alternates: {
        languages: {
          de: `${BASE_URL}/de/home`,
          en: `${BASE_URL}/en/home`,
        },
      },
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      alternates: {
        languages: {
          de: `${BASE_URL}/de/map`,
          en: `${BASE_URL}/en/map`,
        },
      },
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      alternates: {
        languages: {
          de: `${BASE_URL}/de/privacy-policy`,
          en: `${BASE_URL}/en/privacy-policy`,
        },
      },
    },
    {
      url: `${BASE_URL}/imprint`,
      lastModified: new Date(),
      alternates: {
        languages: {
          de: `${BASE_URL}/de/imprint`,
          en: `${BASE_URL}/en/imprint`,
        },
      },
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      alternates: {
        languages: {
          de: `${BASE_URL}/de/terms-of-service`,
          en: `${BASE_URL}/en/terms-of-service`,
        },
      },
    },
  ];

  const regionPages: MetadataRoute.Sitemap = REGIONS.map((region) => ({
    url: `${BASE_URL}/cvms/region/${region.slug}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        de: `${BASE_URL}/de/cvms/region/${region.slug}`,
        en: `${BASE_URL}/en/cvms/region/${region.slug}`,
      },
    },
  }));

  return [...staticPages, ...regionPages];
}
