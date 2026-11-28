"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FacetFrame } from "@/components/ui/FacetFrame";
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

function Meta({ post, locale, minRead }: { post: BlogPreviewItem; locale: Locale; minRead: string }) {
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
      {post.categories[0] && <span className="text-accent-ink">{post.categories[0]}</span>}
      {post.publishedAt && <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt, locale)}</time>}
      <span>
        {post.readTime} {minRead}
      </span>
    </p>
  );
}

export function BlogPreviewSection({ locale, posts }: { locale: Locale; posts: BlogPreviewItem[] }) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;

  if (posts.length === 0) return null;

  const featured = posts.find((p) => p.featured) || posts[0];
  const latest = posts.filter((p) => p.id !== featured.id).slice(0, 3);
  const minRead = t("blog.minRead");

  return (
    <section id="blog" className="section-y border-t border-line">
      <div className="container-site">
        <SectionHeading title={t("home.blog.title")} subtitle={t("home.blog.subtitle")}>
          <Link
            href={`${basePath}/blog`}
            className="mt-5 inline-block text-sm font-medium text-action underline decoration-action/40 underline-offset-4 hover:decoration-action"
          >
            {t("home.blog.viewAll")}
          </Link>
        </SectionHeading>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <article className="lg:col-span-7">
            <Link href={`${basePath}/blog/${featured.slug}`} className="group block">
              <FacetFrame size="md">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={featured.image || "/images/blog-default.jpg"}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>
              </FacetFrame>
              <div className="mt-6">
                <Meta post={featured} locale={locale} minRead={minRead} />
                <h3 className="mt-3 text-subheading text-ink group-hover:underline group-hover:underline-offset-4">
                  {featured.title}
                </h3>
                {featured.excerpt && <p className="mt-3 line-clamp-2 max-w-2xl text-ink-2">{featured.excerpt}</p>}
              </div>
            </Link>
          </article>

          {latest.length > 0 && (
            <ul className="divide-y divide-line border-y border-line lg:col-span-5">
              {latest.map((post) => (
                <li key={post.id}>
                  <Link href={`${basePath}/blog/${post.slug}`} className="group block py-7">
                    <Meta post={post} locale={locale} minRead={minRead} />
                    <h3 className="mt-2 text-lg font-medium text-ink group-hover:underline group-hover:underline-offset-4">
                      {post.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
