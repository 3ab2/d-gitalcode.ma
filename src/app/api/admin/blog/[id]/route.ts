import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: body.slug,
      image: body.image,
      published: body.published,
      featured: body.featured,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    },
    include: { translations: true },
  });

  if (body.translations) {
    for (const t of body.translations) {
      await prisma.blogTranslation.upsert({
        where: { postId_locale: { postId: id, locale: t.locale } },
        create: { postId: id, ...t },
        update: t,
      });
    }
  }

  if (body.categoryIds) {
    await prisma.blogPostCategory.deleteMany({ where: { postId: id } });
    for (const categoryId of body.categoryIds) {
      await prisma.blogPostCategory.create({ data: { postId: id, categoryId } });
    }
  }

  if (body.tagNames) {
    await prisma.blogPostTag.deleteMany({ where: { postId: id } });
    for (const name of body.tagNames) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      const tag = await prisma.blogTag.upsert({
        where: { slug },
        create: { slug, name },
        update: { name },
      });
      await prisma.blogPostTag.create({ data: { postId: id, tagId: tag.id } });
    }
  }

  await logAdminAction({
    userId: session.user.id,
    userEmail: session.user.email,
    action: body.published ? "PUBLISH" : body.published === false ? "UNPUBLISH" : "UPDATE",
    entity: "BlogPost",
    entityId: id,
    metadata: { slug: body.slug },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });

  await logAdminAction({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "DELETE",
    entity: "BlogPost",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}
