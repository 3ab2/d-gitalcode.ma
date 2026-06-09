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

  const service = await prisma.service.update({
    where: { id },
    data: {
      slug: body.slug,
      type: body.type,
      price: body.price,
      priceLabel: body.priceLabel,
      featured: body.featured,
      published: body.published,
      image: body.image,
      demoUrl: body.demoUrl,
      order: body.order,
    },
    include: { translations: true },
  });

  if (body.translations) {
    for (const t of body.translations) {
      await prisma.serviceTranslation.upsert({
        where: {
          serviceId_locale: { serviceId: id, locale: t.locale },
        },
        create: { serviceId: id, ...t },
        update: t,
      });
    }
  }

  await logAdminAction({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "UPDATE",
    entity: "Service",
    entityId: id,
    metadata: { slug: body.slug },
  });

  return NextResponse.json(service);
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
