import type { MetadataRoute } from "next";
import { REGIONS } from "@/lib/regions";

const BASE_URL = "https://www.kippenstummel.de";
const BUILD_DATE = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/de/home`,
      lastModified: BUILD_DATE,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/home`,
          en: `${BASE_URL}/en/home`,
          "x-default": `${BASE_URL}/de/home`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/home`,
      lastModified: BUILD_DATE,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/home`,
          en: `${BASE_URL}/en/home`,
          "x-default": `${BASE_URL}/de/home`,
        },
      },
    },
    {
      url: `${BASE_URL}/de/map`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/map`,
          en: `${BASE_URL}/en/map`,
          "x-default": `${BASE_URL}/de/map`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/map`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/map`,
          en: `${BASE_URL}/en/map`,
          "x-default": `${BASE_URL}/de/map`,
        },
      },
    },
    {
      url: `${BASE_URL}/de/leaderboard`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 0.5,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/leaderboard`,
          en: `${BASE_URL}/en/leaderboard`,
          "x-default": `${BASE_URL}/de/leaderboard`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/leaderboard`,
      lastModified: BUILD_DATE,
      changeFrequency: "daily",
      priority: 0.5,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/leaderboard`,
          en: `${BASE_URL}/en/leaderboard`,
          "x-default": `${BASE_URL}/de/leaderboard`,
        },
      },
    },
    {
      url: `${BASE_URL}/de/privacy-policy`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/privacy-policy`,
          en: `${BASE_URL}/en/privacy-policy`,
          "x-default": `${BASE_URL}/de/privacy-policy`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/privacy-policy`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/privacy-policy`,
          en: `${BASE_URL}/en/privacy-policy`,
          "x-default": `${BASE_URL}/de/privacy-policy`,
        },
      },
    },
    {
      url: `${BASE_URL}/de/imprint`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/imprint`,
          en: `${BASE_URL}/en/imprint`,
          "x-default": `${BASE_URL}/de/imprint`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/imprint`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/imprint`,
          en: `${BASE_URL}/en/imprint`,
          "x-default": `${BASE_URL}/de/imprint`,
        },
      },
    },
    {
      url: `${BASE_URL}/de/terms-of-service`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/terms-of-service`,
          en: `${BASE_URL}/en/terms-of-service`,
          "x-default": `${BASE_URL}/de/terms-of-service`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/terms-of-service`,
      lastModified: BUILD_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/de/terms-of-service`,
          en: `${BASE_URL}/en/terms-of-service`,
          "x-default": `${BASE_URL}/de/terms-of-service`,
        },
      },
    },
  ];

  const regionDePages: MetadataRoute.Sitemap = REGIONS.map((region) => ({
    url: `${BASE_URL}/de/cvms/region/${region.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "weekly",
    priority: 0.7,
    alternates: {
      languages: {
        de: `${BASE_URL}/de/cvms/region/${region.slug}`,
        en: `${BASE_URL}/en/cvms/region/${region.slug}`,
      },
    },
  }));

  const regionEnPages: MetadataRoute.Sitemap = REGIONS.map((region) => ({
    url: `${BASE_URL}/en/cvms/region/${region.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: "weekly",
    priority: 0.7,
    alternates: {
      languages: {
        de: `${BASE_URL}/de/cvms/region/${region.slug}`,
        en: `${BASE_URL}/en/cvms/region/${region.slug}`,
      },
    },
  }));

  return [...staticPages, ...regionDePages, ...regionEnPages];
}
