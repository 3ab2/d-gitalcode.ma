import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const portfolioSchema = z.object({
  slug: z.string(),
  image: z.string().optional(),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
  translations: z.array(
    z.object({
      locale: z.string(),
      title: z.string(),
      description: z.string(),
      client: z.string().optional(),
    })
  ),
});

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
        url: data.url,
        githubUrl: data.githubUrl,
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
