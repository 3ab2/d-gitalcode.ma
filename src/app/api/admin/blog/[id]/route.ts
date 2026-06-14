import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { blogSchema } from "@/lib/admin/schemas";
import { updateBlogPost } from "@/lib/admin/blog-mutations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = blogSchema.parse(body);
    const post = await updateBlogPost(id, data);

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: data.published ? "PUBLISH" : data.published === false ? "UNPUBLISH" : "UPDATE",
      entity: "BlogPost",
      entityId: id,
      metadata: { slug: data.slug },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
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
