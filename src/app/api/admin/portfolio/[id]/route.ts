import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { portfolioSchema } from "@/lib/admin/schemas";

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
    const data = portfolioSchema.parse(body);

    const project = await prisma.portfolioProject.update({
      where: { id },
      data: {
        slug: data.slug,
        image: data.image,
        gallery: data.gallery ?? [],
        url: data.url || null,
        githubUrl: data.githubUrl || null,
        technologies: data.technologies,
        featured: data.featured,
        published: data.published,
        order: data.order,
      },
      include: { translations: true },
    });

    for (const t of data.translations) {
      await prisma.portfolioTranslation.upsert({
        where: { projectId_locale: { projectId: id, locale: t.locale } },
        create: { projectId: id, ...t },
        update: t,
      });
    }

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      entity: "PortfolioProject",
      entityId: id,
      metadata: { slug: data.slug },
    });

    return NextResponse.json(project);
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
  await prisma.portfolioProject.delete({ where: { id } });

  await logAdminAction({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "DELETE",
    entity: "PortfolioProject",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}
