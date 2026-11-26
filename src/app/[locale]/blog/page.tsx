import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { PageHero } from "@/components/ui/PageHero";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import {
  getPublishedPosts,
  getPostTranslation,
  getReadTimeMinutes,
  resolvePostImage,
} from "@/lib/blog";

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
    title: t("blog.title"),
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
            readMinutes: getReadTimeMinutes(translation.content),
          }
        : undefined,
      categories: post.categories,
      tags: post.tags,
    };
  });

  return (
    <>
      <PageHero title={t("blog.title")} lead={t("blog.subtitle")} />
      <section className="pt-12 pb-24 lg:pt-16 lg:pb-32">
        <div className="container-site">
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
    </>
  );
}
