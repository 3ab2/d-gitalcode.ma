import { sendAnalyticsEvent } from "@/lib/analytics/client";

const VIEW_KEY = (slug: string, locale: string) =>
  `dgitalcode-blog-view-${slug}-${locale}`;
const READ_KEY = (slug: string, locale: string) =>
  `dgitalcode-blog-read-${slug}-${locale}`;

function sessionOnce(key: string): boolean {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(key)) return false;
  sessionStorage.setItem(key, "1");
  return true;
}

/** Track a single article view per browser session. */
export function trackBlogArticleView(
  slug: string,
  locale: string,
  category: string
): void {
  if (!sessionOnce(VIEW_KEY(slug, locale))) return;

  sendAnalyticsEvent("blog_article_view", `/${locale}/blog/${slug}`, {
    slug,
    locale,
    category,
    timestamp: new Date().toISOString(),
  });
}

/** Track reading completion (80%+) once per session. */
export function trackBlogArticleRead(slug: string, locale: string): void {
  if (!sessionOnce(READ_KEY(slug, locale))) return;

  sendAnalyticsEvent("blog_article_read", `/${locale}/blog/${slug}`, {
    slug,
    locale,
    timestamp: new Date().toISOString(),
  });
}
