import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { getTranslation } from "@/lib/i18n/server";
import { locales, type Locale } from "@/lib/i18n/settings";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  extractHeadings,
  getPublishedPostBySlug,
  getPublishedPostSlugs,
  getPostTranslation,
  getReadTimeMinutes,
  getRelatedPosts,
  incrementPostViews,
  injectHeadingIds,
  resolvePostImage,
} from "@/lib/blog";
import { getBlogImageAbsoluteUrl } from "@/lib/blog-images";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { BlogShare } from "@/components/blog/BlogShare";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { BlogJsonLd } from "@/components/blog/BlogJsonLd";

export const revalidate = 3600;

const AUTHOR = "D-GITALCODE";

async function getPostForPage(slug: string, locale: Locale) {
  const post = await getPublishedPostBySlug(slug, locale);
  if (post) await incrementPostViews(post.id);
  return post;
}

async function getPostForMeta(slug: string, locale: Locale) {
  return getPublishedPostBySlug(slug, locale);
}

export async function generateStaticParams() {
  const posts = await getPublishedPostSlugs();
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostForMeta(slug, locale as Locale);
  const translation = post ? getPostTranslation(post, locale as Locale) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://d-gitalcode.ma";
  const url = `${siteUrl}/${locale}/blog/${slug}`;
  const cover =
    post && translation
      ? resolvePostImage(post, translation.title).image
      : null;
  const ogImage = cover ? getBlogImageAbsoluteUrl(cover, siteUrl) : undefined;

  return {
    title: translation?.metaTitle || translation?.title || slug,
    description: translation?.metaDescription || translation?.excerpt,
    keywords: translation?.excerpt?.split(" ").slice(0, 8),
    authors: [{ name: AUTHOR }],
    openGraph: {
      type: "article",
      title: translation?.metaTitle || translation?.title,
      description: translation?.metaDescription || translation?.excerpt || undefined,
      images: ogImage ? [{ url: ogImage, alt: translation?.title || "" }] : undefined,
      publishedTime: post?.publishedAt?.toISOString(),
      authors: [AUTHOR],
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: translation?.metaTitle || translation?.title,
      description: translation?.metaDescription || translation?.excerpt || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  const post = await getPostForPage(slug, loc);

  if (!post) notFound();

  const translation = getPostTranslation(post, loc);
  const basePath = `/${locale}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://d-gitalcode.ma";
  const articleUrl = `${siteUrl}/${locale}/blog/${slug}`;
  const cover = resolvePostImage(post, translation?.title || slug);

  const rawContent = translation?.content || "";
  const contentWithIds = injectHeadingIds(rawContent);
  const headings = extractHeadings(contentWithIds);
  const readTime = getReadTimeMinutes(rawContent);

  const categoryIds = post.categories.map((c) => c.categoryId);
  const related = await getRelatedPosts(post.id, categoryIds, loc);

  const relatedSerialized = related.map((r) => {
    const tr = getPostTranslation(r, loc);
    return {
      id: r.id,
      slug: r.slug,
      image: resolvePostImage(r, tr?.title || r.slug).image,
      featured: r.featured,
      publishedAt: r.publishedAt,
      translation: tr
        ? { title: tr.title, excerpt: tr.excerpt, content: tr.content }
        : undefined,
      categories: r.categories,
      tags: r.tags,
    };
  });

  return (
    <>
      <BlogJsonLd
        title={translation?.title || slug}
        description={translation?.metaDescription || translation?.excerpt}
        url={articleUrl}
        image={getBlogImageAbsoluteUrl(cover.image, siteUrl)}
        datePublished={post.publishedAt?.toISOString()}
        author={AUTHOR}
      />

      <article className="pt-10 pb-16 md:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`${basePath}/blog`}
            className="text-sm text-brand-green hover:underline"
          >
            ← {t("blog.title")}
          </Link>

          <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
            <div className="min-w-0">
              <header>
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.categories.map(({ category }) => (
                    <Badge key={category.id} variant="purple">
                      {category.translations[0]?.name || category.slug}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  {translation?.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/40">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {AUTHOR}
                  </span>
                  {post.publishedAt && (
                    <time>{formatDate(post.publishedAt, locale)}</time>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readTime} {t("blog.minRead")}
                  </span>
                </div>

                <div className="mt-6">
                  <BlogShare
                    url={articleUrl}
                    title={translation?.title || ""}
                    label={t("blog.share")}
                  />
                </div>
              </header>

              {cover.image && (
                <div className="relative mt-8 h-64 overflow-hidden rounded-2xl md:h-96">
                  <Image
                    src={cover.image}
                    alt={cover.alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 768px"
                  />
                </div>
              )}

              <div
                className="prose-blog mt-10"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {post.tags.length > 0 && (
                <div className="mt-12 border-t border-white/10 pt-8">
                  <h3 className="mb-3 text-sm font-medium text-white/50">
                    {t("blog.tags")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(({ tag }) => (
                      <Badge key={tag.id}>{tag.name}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <RelatedArticles
                posts={relatedSerialized}
                basePath={basePath}
                locale={locale}
                title={t("blog.related")}
                readMoreLabel={t("blog.readMore")}
                minReadLabel={t("blog.minRead")}
              />
            </div>

            <aside className="mt-10 hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents headings={headings} title={t("blog.toc")} />
              </div>
            </aside>
          </div>

          {headings.length > 0 && (
            <div className="mt-8 lg:hidden">
              <TableOfContents headings={headings} title={t("blog.toc")} />
            </div>
          )}
        </div>
      </article>
    </>
  );
}
