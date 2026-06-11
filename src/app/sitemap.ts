import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n/settings";
import { buildSitemapLanguages, getSiteUrl } from "@/lib/seo/metadata";

const STATIC_ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "portfolio", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "blog", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "services/web-development", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "services/mobile-apps", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "services/wordpress-plugins", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "services/wordpress-templates", priority: 0.8, changeFrequency: "monthly" as const },
];

function sitemapEntry(
  path: string,
  locale: string,
  options: {
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    lastModified?: Date;
  }
): MetadataRoute.Sitemap[number] {
  const baseUrl = getSiteUrl();
  const normalized = path ? `/${path}` : "";
  return {
    url: `${baseUrl}/${locale}${normalized}`,
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: buildSitemapLanguages(path),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of locales) {
      entries.push(
        sitemapEntry(route.path, locale, {
          priority: route.priority,
          changeFrequency: route.changeFrequency,
        })
      );
    }
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    for (const post of posts) {
      const lastModified = post.updatedAt ?? post.publishedAt ?? new Date();
      const path = `blog/${post.slug}`;
      for (const locale of locales) {
        entries.push(
          sitemapEntry(path, locale, {
            priority: 0.7,
            changeFrequency: "monthly",
            lastModified,
          })
        );
      }
    }
  } catch {
    /* DB unavailable at build time */
  }

  return entries;
}
