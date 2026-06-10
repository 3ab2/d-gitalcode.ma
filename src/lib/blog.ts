import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/i18n/settings";
import { estimateReadTime } from "@/lib/portfolio-category";

export const BLOG_POSTS_PER_PAGE = 12;
export const BLOG_REVALIDATE_SECONDS = 3600;

const postInclude = (locale: Locale) => ({
  translations: { where: { locale } },
  categories: {
    include: {
      category: { include: { translations: { where: { locale } } } },
    },
  },
  tags: { include: { tag: true } },
});

export type BlogPostListItem = Awaited<ReturnType<typeof getPublishedPosts>>[number];
export type BlogPostDetail = NonNullable<Awaited<ReturnType<typeof getPublishedPostBySlug>>>;

export async function getPublishedPosts(locale: Locale) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: postInclude(locale),
  });
}

export async function getPublishedPostSlugs() {
  return prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
}

export async function getPublishedPostBySlug(slug: string, locale: Locale) {
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: postInclude(locale),
  });
}

export async function incrementPostViews(postId: string) {
  await prisma.blogPost.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });
}

export async function getRelatedPosts(
  postId: string,
  categoryIds: string[],
  locale: Locale,
  limit = 3
) {
  if (categoryIds.length === 0) {
    return prisma.blogPost.findMany({
      where: { published: true, id: { not: postId } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: postInclude(locale),
    });
  }

  return prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: postId },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: postInclude(locale),
  });
}

export async function getAllBlogTags() {
  return prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getAllBlogCategories(locale: Locale) {
  return prisma.blogCategory.findMany({
    orderBy: { slug: "asc" },
    include: {
      translations: { where: { locale } },
      _count: { select: { posts: true } },
    },
  });
}

export type BlogTranslationFields = {
  locale: string;
  title: string;
  excerpt: string | null;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export function getPostTranslation<
  T extends { translations: BlogTranslationFields[] },
>(post: T, locale: Locale): BlogTranslationFields | undefined {
  return post.translations.find((t) => t.locale === locale) ?? post.translations[0];
}

export function getCategoryName(
  category: { slug: string; translations: Array<{ name: string }> },
  locale: Locale
) {
  return category.translations[0]?.name ?? category.slug;
}

export function getReadTimeMinutes(content: string): number {
  const text = content.replace(/<[^>]+>/g, " ");
  return estimateReadTime(text);
}

export function extractHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    const id = `section-${index++}`;
    headings.push({ id, text, level: Number(match[1]) });
  }

  return headings;
}

export function injectHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (_full, level, attrs, inner) => {
    const id = `section-${index++}`;
    if (/\bid=/.test(attrs)) return `<h${level}${attrs}>${inner}</h${level}>`;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}
