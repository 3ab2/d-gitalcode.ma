"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getReadTimeMinutes } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export type BlogCardPost = {
  id: string;
  slug: string;
  image: string | null;
  featured: boolean;
  publishedAt: Date | null;
  translation?: {
    title: string;
    excerpt: string | null;
    content: string;
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
  const readTime = translation?.content
    ? getReadTimeMinutes(translation.content)
    : 3;

  return (
    <Link href={`${basePath}/blog/${post.slug}`} className="group block h-full">
      <Card
        className={`h-full overflow-hidden p-0 transition-all duration-300 hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5 ${
          featured ? "md:grid md:grid-cols-2" : ""
        }`}
      >
        <div
          className={`relative bg-brand-card/50 ${
            featured ? "min-h-[220px] md:min-h-full" : "h-48"
          }`}
        >
          {post.image ? (
            <Image
              src={post.image}
              alt={translation?.title || post.slug}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 via-brand-purple/10 to-brand-dark" />
          )}
        </div>
        <div className="flex flex-col p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
            {post.publishedAt && (
              <time>{formatDate(post.publishedAt, locale)}</time>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime} {minReadLabel}
            </span>
          </div>
          {post.categories[0] && (
            <Badge variant="purple" className="mt-3 w-fit text-[10px]">
              {post.categories[0].category.translations[0]?.name ||
                post.categories[0].category.slug}
            </Badge>
          )}
          <h3
            className={`mt-2 font-semibold text-white transition-colors group-hover:text-brand-green ${
              featured ? "text-xl md:text-2xl" : "text-lg"
            }`}
          >
            {translation?.title || post.slug}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50 line-clamp-3">
            {translation?.excerpt}
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-brand-green">
            {readMoreLabel} →
          </span>
        </div>
      </Card>
    </Link>
  );
}
