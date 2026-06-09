import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/settings";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://d-gitalcode.ma";

  const routes = [
    "",
    "/services/web-development",
    "/services/mobile-apps",
    "/services/wordpress-plugins",
    "/services/wordpress-templates",
    "/portfolio",
    "/about",
    "/blog",
    "/contact",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
