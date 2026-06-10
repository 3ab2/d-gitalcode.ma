import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/settings";
import { getPublishedPostSlugs } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.8,
      });
    }
  }

  try {
    const posts = await getPublishedPostSlugs();
    for (const locale of locales) {
      for (const post of posts) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch {
    /* DB unavailable at build time */
  }

  return entries;
}
