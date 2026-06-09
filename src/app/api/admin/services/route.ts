import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const serviceSchema = z.object({
  slug: z.string(),
  type: z.enum([
    "WEB_DEVELOPMENT",
    "MOBILE_APPS",
    "WORDPRESS_PLUGINS",
    "WORDPRESS_TEMPLATES",
  ]),
  price: z.number().optional(),
  priceLabel: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  image: z.string().optional(),
  demoUrl: z.string().optional(),
  order: z.number().optional(),
  translations: z.array(
    z.object({
      locale: z.string(),
      title: z.string(),
      description: z.string(),
      shortDesc: z.string().optional(),
      features: z.array(z.string()).optional(),
    })
  ),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        slug: data.slug,
        type: data.type,
        price: data.price,
        priceLabel: data.priceLabel,
        featured: data.featured ?? false,
        published: data.published ?? true,
        image: data.image,
        demoUrl: data.demoUrl,
        order: data.order ?? 0,
        translations: {
          create: data.translations,
        },
      },
      include: { translations: true },
    });

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "CREATE",
      entity: "Service",
      entityId: service.id,
      metadata: { slug: service.slug },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
