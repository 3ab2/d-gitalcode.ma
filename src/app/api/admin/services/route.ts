import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

import { serviceSchema } from "@/lib/admin/schemas";

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
        demoUrl: data.demoUrl || null,
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
