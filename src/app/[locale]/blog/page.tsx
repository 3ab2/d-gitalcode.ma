import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { getPublishedPosts, getPostTranslation, resolvePostImage } from "@/lib/blog";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  return buildPublicPageMetadata({
    locale: loc,
    path: "blog",
    title: `${t("blog.title")} | D-GITALCODE`,
    description: t("blog.subtitle"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  const posts = await getPublishedPosts(loc);
  const basePath = `/${locale}`;

  const serialized = posts.map((post) => {
    const translation = getPostTranslation(post, loc);
    const title = translation?.title || post.slug;
    return {
      id: post.id,
      slug: post.slug,
      image: resolvePostImage(post, title).image,
      featured: post.featured,
      publishedAt: post.publishedAt,
      translation: translation
        ? {
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content,
          }
        : undefined,
      categories: post.categories,
      tags: post.tags,
    };
  });

  return (
    <section className="pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("blog.title")} subtitle={t("blog.subtitle")} />
        <BlogListClient
          posts={serialized}
          basePath={basePath}
          locale={locale}
          labels={{
            search: t("blog.search"),
            allTags: t("blog.allTags"),
            featured: t("blog.featuredArticle"),
            readMore: t("blog.readMore"),
            minRead: t("blog.minRead"),
            empty: t("blog.noResults"),
            articles: t("blog.articleCount"),
          }}
        />
      </div>
    </section>
  );
}
