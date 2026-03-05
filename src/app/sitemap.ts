import type { MetadataRoute } from "next";

import { listLessons } from "@/lib/course";
import { listPrintables } from "@/lib/printables";

const BASE = "https://academy.tbsoftwash.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/course`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/course/printables`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const lessonUrls: MetadataRoute.Sitemap = listLessons().map((l) => {
    const url =
      l.track === "core"
        ? `${BASE}/course/core/${l.module}/${l.slug}`
        : `${BASE}/course/springboard/${l.week}/${l.slug}`;

    return {
      url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  const printableUrls: MetadataRoute.Sitemap = listPrintables().map((p) => ({
    url: `${BASE}/course/printables/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticUrls, ...lessonUrls, ...printableUrls];
}
