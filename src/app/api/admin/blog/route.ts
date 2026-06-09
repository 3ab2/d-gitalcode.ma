import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const blogSchema = z.object({
  slug: z.string(),
  image: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().optional(),
  translations: z.array(
    z.object({
      locale: z.string(),
      title: z.string(),
      excerpt: z.string().optional(),
      content: z.string(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
  ),
  categoryIds: z.array(z.string()).optional(),
  tagNames: z.array(z.string()).optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      translations: true,
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = blogSchema.parse(body);

    const post = await prisma.blogPost.create({
      data: {
        slug: data.slug,
        image: data.image,
        published: data.published ?? false,
        featured: data.featured ?? false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        translations: { create: data.translations },
        categories: data.categoryIds
          ? {
              create: data.categoryIds.map((categoryId) => ({ categoryId })),
            }
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

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: data.published ? "PUBLISH" : "CREATE",
      entity: "BlogPost",
      entityId: post.id,
      metadata: { slug: post.slug },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
