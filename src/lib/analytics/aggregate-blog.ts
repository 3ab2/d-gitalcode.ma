import { prisma } from "@/lib/prisma";

export const BLOG_ANALYTICS_EVENTS = [
  "blog_article_view",
  "blog_article_read",
  "blog_cta_quote_click",
] as const;

type RankedItem = { slug: string; title: string; count: number };
type CategoryRank = { category: string; count: number };

function metaString(metadata: unknown, key: string): string | undefined {
  if (!metadata || typeof metadata !== "object") return undefined;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

function bump(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

export type BlogAnalyticsSummary = {
  totalViews: number;
  totalReads: number;
  quoteRequests: number;
  ctaConversionRate: number;
  mostViewedArticles: RankedItem[];
  mostReadArticles: RankedItem[];
  topCategories: CategoryRank[];
  viewsByDay: Record<string, number>;
  readsByDay: Record<string, number>;
};

export async function aggregateBlogAnalytics(
  days = 30
): Promise<BlogAnalyticsSummary> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      event: { in: [...BLOG_ANALYTICS_EVENTS] },
      createdAt: { gte: since },
    },
    select: { event: true, metadata: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const viewsBySlug = new Map<string, number>();
  const readsBySlug = new Map<string, number>();
  const viewsByCategory = new Map<string, number>();
  const viewsByDay: Record<string, number> = {};
  const readsByDay: Record<string, number> = {};

  let totalViews = 0;
  let totalReads = 0;
  let quoteRequests = 0;

  for (const row of events) {
    const slug = metaString(row.metadata, "slug");
    const category = metaString(row.metadata, "category");
    const day = row.createdAt.toISOString().split("T")[0];

    switch (row.event) {
      case "blog_article_view":
        totalViews++;
        if (slug) bump(viewsBySlug, slug);
        if (category) bump(viewsByCategory, category);
        viewsByDay[day] = (viewsByDay[day] ?? 0) + 1;
        break;
      case "blog_article_read":
        totalReads++;
        if (slug) bump(readsBySlug, slug);
        readsByDay[day] = (readsByDay[day] ?? 0) + 1;
        break;
      case "blog_cta_quote_click":
        quoteRequests++;
        break;
    }
  }

  const slugs = [
    ...new Set([
      ...viewsBySlug.keys(),
      ...readsBySlug.keys(),
    ]),
  ];

  const posts = slugs.length
    ? await prisma.blogPost.findMany({
        where: { slug: { in: slugs } },
        select: {
          slug: true,
          translations: { where: { locale: "en" }, take: 1, select: { title: true } },
        },
      })
    : [];

  const titleBySlug = new Map(
    posts.map((p) => [p.slug, p.translations[0]?.title ?? p.slug])
  );

  const toRanked = (map: Map<string, number>, limit = 8): RankedItem[] =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([slug, count]) => ({
        slug,
        title: titleBySlug.get(slug) ?? slug,
        count,
      }));

  const topCategories: CategoryRank[] = [...viewsByCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category, count]) => ({ category, count }));

  const ctaConversionRate =
    totalViews > 0 ? Math.round((quoteRequests / totalViews) * 1000) / 10 : 0;

  return {
    totalViews,
    totalReads,
    quoteRequests,
    ctaConversionRate,
    mostViewedArticles: toRanked(viewsBySlug),
    mostReadArticles: toRanked(readsBySlug),
    topCategories,
    viewsByDay,
    readsByDay,
  };
}
