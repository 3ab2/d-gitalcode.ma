import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

import { portfolioSchema } from "@/lib/admin/schemas";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.portfolioProject.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = portfolioSchema.parse(body);

    const project = await prisma.portfolioProject.create({
      data: {
        slug: data.slug,
        image: data.image,
        gallery: data.gallery ?? [],
        url: data.url || null,
        githubUrl: data.githubUrl || null,
        technologies: data.technologies ?? [],
        featured: data.featured ?? false,
        published: data.published ?? true,
        order: data.order ?? 0,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "CREATE",
      entity: "PortfolioProject",
      entityId: project.id,
      metadata: { slug: project.slug },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
