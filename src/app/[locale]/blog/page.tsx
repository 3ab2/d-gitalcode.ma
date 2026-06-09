import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
};

async function getPosts(locale: Locale) {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      include: {
        translations: { where: { locale } },
        categories: {
          include: {
            category: {
              include: { translations: { where: { locale } } },
            },
          },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale as Locale);
  const posts = await getPosts(locale as Locale);
  const basePath = `/${locale}`;

  return (
    <section className="pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("blog.title")} subtitle={t("blog.subtitle")} />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const translation = post.translations[0];
            return (
              <Link key={post.id} href={`${basePath}/blog/${post.slug}`}>
                <Card className="h-full overflow-hidden p-0 cursor-pointer">
                  {post.image && (
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={translation?.title || post.slug}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      {post.publishedAt && (
                        <time>{formatDate(post.publishedAt, locale)}</time>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white hover:text-brand-green transition-colors">
                      {translation?.title || post.slug}
                    </h3>
                    <p className="mt-2 text-sm text-white/50 line-clamp-3">
                      {translation?.excerpt}
                    </p>
                    <span className="mt-4 inline-block text-sm text-brand-green">
                      {t("blog.readMore")} →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-white/50 mt-16">{t("blog.subtitle")}</p>
        )}
      </div>
    </section>
  );
}
