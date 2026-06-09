import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const categorySchema = z.object({
  slug: z.string(),
  translations: z.array(
    z.object({ locale: z.string(), name: z.string() })
  ),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.blogCategory.findMany({
    include: { translations: true, posts: true },
    orderBy: { slug: "asc" },
  });

  const tags = await prisma.blogTag.findMany({
    include: { posts: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ categories, tags });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = categorySchema.parse(body);

    const category = await prisma.blogCategory.create({
      data: {
        slug: data.slug,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "CREATE",
      entity: "category",
      entityId: category.id,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
