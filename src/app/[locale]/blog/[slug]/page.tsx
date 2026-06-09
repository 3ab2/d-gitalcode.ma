import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

async function getPost(slug: string, locale: Locale) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: {
        translations: { where: { locale } },
        categories: {
          include: {
            category: {
              include: { translations: { where: { locale } } },
            },
          },
        },
        tags: { include: { tag: true } },
      },
    });

    if (post) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });
    }

    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale as Locale);
  const translation = post?.translations[0];

  return {
    title: translation?.metaTitle || translation?.title || slug,
    description: translation?.metaDescription || translation?.excerpt,
    openGraph: {
      title: translation?.metaTitle || translation?.title,
      description: translation?.metaDescription || translation?.excerpt || undefined,
      images: post?.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { t } = await getTranslation(locale as Locale);
  const post = await getPost(slug, locale as Locale);

  if (!post) notFound();

  const translation = post.translations[0];
  const basePath = `/${locale}`;

  return (
    <article className="pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`${basePath}/blog`}
          className="text-sm text-brand-green hover:underline"
        >
          ← {t("blog.title")}
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(({ category }) => (
              <Badge key={category.id} variant="purple">
                {category.translations[0]?.name || category.slug}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {translation?.title}
          </h1>

          {post.publishedAt && (
            <time className="mt-4 block text-sm text-white/40">
              {formatDate(post.publishedAt, locale)}
            </time>
          )}
        </header>

        {post.image && (
          <div className="relative mt-8 h-64 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={translation?.title || ""}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose-blog mt-10"
          dangerouslySetInnerHTML={{ __html: translation?.content || "" }}
        />

        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-sm font-medium text-white/50 mb-3">
              {t("blog.tags")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
