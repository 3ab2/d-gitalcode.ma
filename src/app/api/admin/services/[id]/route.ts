import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { serviceSchema } from "@/lib/admin/schemas";

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
    const data = serviceSchema.parse(body);

    const service = await prisma.service.update({
      where: { id },
      data: {
        slug: data.slug,
        type: data.type,
        price: data.price ?? undefined,
        priceLabel: data.priceLabel,
        featured: data.featured,
        published: data.published,
        image: data.image,
        demoUrl: data.demoUrl || null,
        order: data.order,
      },
      include: { translations: true },
    });

    for (const t of data.translations) {
      await prisma.serviceTranslation.upsert({
        where: {
          serviceId_locale: { serviceId: id, locale: t.locale },
        },
        create: { serviceId: id, ...t },
        update: t,
      });
    }

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      entity: "Service",
      entityId: id,
      metadata: { slug: data.slug },
    });

    return NextResponse.json(service);
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
  await prisma.service.delete({ where: { id } });

  await logAdminAction({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "DELETE",
    entity: "Service",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}
