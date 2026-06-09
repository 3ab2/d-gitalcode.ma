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

  const project = await prisma.portfolioProject.update({
    where: { id },
    data: {
      slug: body.slug,
      image: body.image,
      url: body.url,
      githubUrl: body.githubUrl,
      technologies: body.technologies,
      featured: body.featured,
      published: body.published,
      order: body.order,
    },
    include: { translations: true },
  });

  if (body.translations) {
    for (const t of body.translations) {
      await prisma.portfolioTranslation.upsert({
        where: { projectId_locale: { projectId: id, locale: t.locale } },
        create: { projectId: id, ...t },
        update: t,
      });
    }
  }

  await logAdminAction({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "UPDATE",
    entity: "PortfolioProject",
    entityId: id,
    metadata: { slug: body.slug },
  });

  return NextResponse.json(project);
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
