import type { BlogCardPost } from "@/components/blog/BlogCard";

const CATEGORY_ORDER = [
  "web-development",
  "mobile-apps",
  "ui-ux",
  "saas",
  "seo",
  "cybersecurity",
  "javascript-typescript",
  "react-nextjs",
  "business-digital",
  "freelancing",
  "woocommerce",
] as const;

function getCategorySlug(post: BlogCardPost): string {
  return post.categories[0]?.category.slug ?? "web-development";
}

/**
 * Round-robin grid ordering so adjacent cards (rows of 3) mix categories
 * and avoid clusters of similar coding/laptop visuals.
 */
export function diversifyGridOrder(posts: BlogCardPost[]): BlogCardPost[] {
  if (posts.length <= 1) return posts;

  const buckets = new Map<string, BlogCardPost[]>();
  for (const post of posts) {
    const cat = getCategorySlug(post);
    if (!buckets.has(cat)) buckets.set(cat, []);
    buckets.get(cat)!.push(post);
  }

  const orderedKeys = [
    ...CATEGORY_ORDER.filter((k) => buckets.has(k)),
    ...[...buckets.keys()].filter(
      (k) => !CATEGORY_ORDER.includes(k as (typeof CATEGORY_ORDER)[number])
    ),
  ];

  const result: BlogCardPost[] = [];
  let remaining = posts.length;

  while (remaining > 0) {
    let progressed = false;
    for (const key of orderedKeys) {
      const bucket = buckets.get(key);
      if (bucket?.length) {
        result.push(bucket.shift()!);
        remaining--;
        progressed = true;
      }
    }
    if (!progressed) break;
  }

  return result;
}

/**
 * Pick the strongest featured hero: prefer the designated primary slug,
 * otherwise the first featured post in feed order.
 */
export function pickFeaturedPost(
  posts: BlogCardPost[],
  primarySlug = "nextjs-vs-traditional-cms-2026"
): BlogCardPost | undefined {
  const featured = posts.filter((p) => p.featured);
  if (!featured.length) return posts[0];

  return (
    featured.find((p) => p.slug === primarySlug) ??
    featured[0] ??
    posts[0]
  );
}
