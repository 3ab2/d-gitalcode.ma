import { sendAnalyticsEvent } from "@/lib/analytics/client";

export type BlogCtaAction = "quote";

export type BlogCtaEvent = {
  event: BlogCtaAction;
  timestamp: string;
  slug: string;
  locale: string;
};

const QUEUE_KEY = "dgitalcode-blog-cta-queue";

function readQueue(): BlogCtaEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as BlogCtaEvent[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(events: BlogCtaEvent[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-100)));
}

/** Track blog CTA clicks for conversion analytics. */
export function trackBlogCtaClick(
  action: BlogCtaAction,
  slug: string,
  locale: string
): void {
  if (typeof window === "undefined") return;

  const entry: BlogCtaEvent = {
    event: action,
    timestamp: new Date().toISOString(),
    slug,
    locale,
  };

  writeQueue([...readQueue(), entry]);

  sendAnalyticsEvent("blog_cta_quote_click", `/${locale}/blog/${slug}`, {
    slug,
    locale,
    action,
    timestamp: new Date().toISOString(),
  });
}

export function getBlogCtaEventQueue(): BlogCtaEvent[] {
  return readQueue();
}
