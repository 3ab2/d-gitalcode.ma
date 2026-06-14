import { prisma } from "@/lib/prisma";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";
import type { z } from "zod";
import type { blogSchema } from "@/lib/admin/schemas";

type BlogInput = z.infer<typeof blogSchema>;

function sanitizeTranslations(translations: BlogInput["translations"]) {
  return translations.map((t) => ({
    ...t,
    content: sanitizeBlogHtml(t.content),
  }));
}

export async function createBlogPost(data: BlogInput) {
  const translations = sanitizeTranslations(data.translations);

  const post = await prisma.blogPost.create({
    data: {
      slug: data.slug,
      image: data.image,
      published: data.published ?? false,
      featured: data.featured ?? false,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      translations: { create: translations },
      categories: data.categoryIds
        ? { create: data.categoryIds.map((categoryId) => ({ categoryId })) }
        : undefined,
    },
    include: { translations: true },
  });

  if (data.tagNames) {
    for (const name of data.tagNames) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      const tag = await prisma.blogTag.upsert({
        where: { slug },
        create: { slug, name },
        update: { name },
      });
      await prisma.blogPostTag.create({
        data: { postId: post.id, tagId: tag.id },
      });
    }
  }

  return post;
}

export async function updateBlogPost(id: string, data: BlogInput) {
  const translations = sanitizeTranslations(data.translations);

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: data.slug,
      image: data.image,
      published: data.published,
      featured: data.featured,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    },
    include: { translations: true },
  });

  for (const t of translations) {
    await prisma.blogTranslation.upsert({
      where: { postId_locale: { postId: id, locale: t.locale } },
      create: { postId: id, ...t },
      update: t,
    });
  }

  if (data.categoryIds) {
    await prisma.blogPostCategory.deleteMany({ where: { postId: id } });
    for (const categoryId of data.categoryIds) {
      await prisma.blogPostCategory.create({ data: { postId: id, categoryId } });
    }
  }

  if (data.tagNames) {
    await prisma.blogPostTag.deleteMany({ where: { postId: id } });
    for (const name of data.tagNames) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      const tag = await prisma.blogTag.upsert({
        where: { slug },
        create: { slug, name },
        update: { name },
      });
      await prisma.blogPostTag.create({ data: { postId: id, tagId: tag.id } });
    }
  }

  return post;
}
