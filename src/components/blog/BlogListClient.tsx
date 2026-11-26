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
    <div className="mt-12 space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/55 focus:border-brand-green/40 focus:outline-none"
          />
        </div>
        <p className="text-sm text-white/60">
          {filtered.length} {labels.articles}
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              !activeTag
                ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
                : "border-white/10 text-white/50 hover:text-white"
            )}
          >
            {labels.allTags}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                activeTag === tag
                  ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
                  : "border-white/10 text-white/50 hover:text-white"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {featured && (
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-green">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <p className="py-16 text-center text-white/60">{labels.empty}</p>
      )}
    </div>
  );
}
