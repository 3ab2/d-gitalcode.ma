"use client";

import Image from "next/image";
import Link from "next/link";
import { FacetFrame } from "@/components/ui/FacetFrame";
import { cn, formatDate } from "@/lib/utils";

export type BlogCardPost = {
  id: string;
  slug: string;
  image: string | null;
  featured: boolean;
  publishedAt: Date | null;
  translation?: {
    title: string;
    excerpt: string | null;
    readMinutes: number;
  };
  categories: Array<{
    category: {
      slug: string;
      translations: Array<{ name: string }>;
    };
  }>;
  tags: Array<{ tag: { name: string } }>;
};

export function BlogCard({
  post,
  basePath,
  locale,
  readMoreLabel,
  minReadLabel,
  featured = false,
}: {
  post: BlogCardPost;
  basePath: string;
  locale: string;
  readMoreLabel: string;
  minReadLabel: string;
  featured?: boolean;
}) {
  const translation = post.translation;
  const readTime = translation?.readMinutes ?? 3;

  const category = post.categories[0]
    ? post.categories[0].category.translations[0]?.name || post.categories[0].category.slug
    : null;

  return (
    <Link
      href={`${basePath}/blog/${post.slug}`}
      className={cn("group block h-full", featured && "md:grid md:grid-cols-12 md:items-center md:gap-10")}
    >
      <FacetFrame size={featured ? "lg" : "md"} className={cn(featured && "md:col-span-7")}>
        <div className={cn("relative", featured ? "aspect-[16/9]" : "aspect-[16/10]")}>
          <Image
            src={post.image || "/images/blog-default.jpg"}
            alt=""
            fill
            className="object-cover"
            sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
            loading={featured ? "eager" : "lazy"}
            priority={featured}
          />
        </div>
      </FacetFrame>
      <div className={cn("mt-6", featured && "md:col-span-5 md:mt-0")}>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
          {category && <span className="text-accent-ink">{category}</span>}
          {post.publishedAt && <time>{formatDate(post.publishedAt, locale)}</time>}
          <span>
            {readTime} {minReadLabel}
          </span>
        </p>
        <h3
          className={cn(
            "mt-3 text-ink group-hover:underline group-hover:underline-offset-4",
            featured ? "text-subheading md:text-[1.75rem] md:leading-tight" : "text-lg font-medium"
          )}
        >
          {translation?.title || post.slug}
        </h3>
        {translation?.excerpt && <p className="mt-3 line-clamp-3 text-ink-2">{translation.excerpt}</p>}
        <span className="sr-only">{readMoreLabel}</span>
      </div>
    </Link>
  );
}
