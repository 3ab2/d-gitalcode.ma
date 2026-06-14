import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { blogSchema } from "@/lib/admin/schemas";
import { createBlogPost } from "@/lib/admin/blog-mutations";

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
    const post = await createBlogPost(data);

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
