"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/settings";

export interface BlogPreviewItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  publishedAt: Date | string | null;
  readTime: number;
  categories: string[];
  featured: boolean;
}

export function BlogPreviewSection({
  locale,
  posts,
}: {
  locale: Locale;
  posts: BlogPreviewItem[];
}) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;

  if (posts.length === 0) return null;

  const featured = posts.find((p) => p.featured) || posts[0];
  const latest = posts.filter((p) => p.id !== featured.id).slice(0, 3);

  return (
    <section id="blog" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-brand-green/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("home.blog.title")} subtitle={t("home.blog.subtitle")} />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Link href={`${basePath}/blog/${featured.slug}`} className="group block">
            <GlassCard className="h-full overflow-hidden p-0">
              <div className="relative aspect-[16/9] bg-brand-card">
                {featured.image && (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <Badge variant="green" className="mb-3">
                    {t("home.blog.featured")}
                  </Badge>
                  <h3 className="text-2xl font-bold text-white group-hover:text-brand-green transition-colors">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="mt-3 line-clamp-2 text-white/60">{featured.excerpt}</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/45">
                    {featured.publishedAt && (
                      <time>{formatDate(featured.publishedAt, locale)}</time>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readTime} {t("blog.minRead")}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>

          <div className="flex flex-col gap-4">
            {latest.map((post) => (
              <Link key={post.id} href={`${basePath}/blog/${post.slug}`} className="group block">
                <GlassCard className="flex gap-4 p-4 sm:p-5">
                  {post.image && (
                    <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-xl sm:block">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {post.categories[0] && (
                      <span className="text-xs font-medium text-brand-green">
                        {post.categories[0]}
                      </span>
                    )}
                    <h4 className="mt-1 font-semibold text-white group-hover:text-brand-green transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                      {post.publishedAt && (
                        <time>{formatDate(post.publishedAt, locale)}</time>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime} {t("blog.minRead")}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 self-center text-white/30 group-hover:text-brand-green" />
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`${basePath}/blog`}
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-green hover:underline"
          >
            {t("home.blog.viewAll")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
