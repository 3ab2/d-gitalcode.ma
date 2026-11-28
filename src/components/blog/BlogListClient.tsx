"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BlogCard, type BlogCardPost } from "@/components/blog/BlogCard";
import { diversifyGridOrder, pickFeaturedPost } from "@/lib/blog-grid";
import { cn } from "@/lib/utils";

export function BlogListClient({
  posts,
  basePath,
  locale,
  labels,
}: {
  posts: BlogCardPost[];
  basePath: string;
  locale: string;
  labels: {
    search: string;
    allTags: string;
    featured: string;
    readMore: string;
    minRead: string;
    empty: string;
    articles: string;
  };
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t.tag.name)));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const title = post.translation?.title?.toLowerCase() ?? "";
      const excerpt = post.translation?.excerpt?.toLowerCase() ?? "";
      const matchesQuery =
        !q || title.includes(q) || excerpt.includes(q) || post.slug.includes(q);
      const matchesTag =
        !activeTag || post.tags.some((t) => t.tag.name === activeTag);
      return matchesQuery && matchesTag;
    });
  }, [posts, query, activeTag]);

  const featured = pickFeaturedPost(filtered);
  const gridPosts = diversifyGridOrder(
    filtered.filter((p) => p.id !== featured?.id)
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search aria-hidden className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            aria-label={labels.search}
            className="h-11 w-full rounded-control border border-line-strong bg-bg ps-10 pe-4 text-[0.9375rem] text-ink placeholder:text-ink-3 focus:border-action focus:outline-none focus:ring-2 focus:ring-action/25"
          />
        </div>
        <p className="text-sm text-ink-3" aria-live="polite">
          {filtered.length} {labels.articles}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={!activeTag}
            className={cn(
              "min-h-9 rounded-md border px-3 py-1.5 text-sm transition-colors",
              !activeTag
                ? "border-white/40 bg-white/[0.08] text-ink"
                : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
            )}
          >
            {labels.allTags}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              aria-pressed={activeTag === tag}
              className={cn(
                "min-h-9 rounded-md border px-3 py-1.5 text-sm transition-colors",
                activeTag === tag
                  ? "border-white/40 bg-white/[0.08] text-ink"
                  : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {featured && (
        <div>
          <p className="mb-5 text-sm text-accent-ink">
            {labels.featured}
          </p>
          <BlogCard
            post={featured}
            basePath={basePath}
            locale={locale}
            readMoreLabel={labels.readMore}
            minReadLabel={labels.minRead}
            featured
          />
        </div>
      )}

      {gridPosts.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              basePath={basePath}
              locale={locale}
              readMoreLabel={labels.readMore}
              minReadLabel={labels.minRead}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-16 text-ink-2">{labels.empty}</p>
      )}
    </div>
  );
}
