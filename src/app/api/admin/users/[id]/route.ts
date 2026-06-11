import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import {
  collectUserAttachmentAssets,
  purgeAttachmentRecord,
} from "@/lib/attachments/cleanup";

const patchSchema = z
  .object({
    active: z.boolean(),
  })
  .strict();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Cannot modify your own account from this panel." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    if (body && typeof body === "object" && "role" in body) {
      return NextResponse.json(
        { error: "Role changes are not permitted." },
        { status: 403 }
      );
    }

    const data = patchSchema.parse(body);

    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot be modified from this panel." },
        { status: 403 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { active: data.active },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      entity: "user",
      entityId: id,
      metadata: { active: data.active },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[admin/users/patch] Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
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

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account." },
      { status: 400 }
    );
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted from this panel." },
        { status: 403 }
      );
    }

    const attachmentAssets = await collectUserAttachmentAssets(id);

    await prisma.user.delete({ where: { id } });

    for (const asset of attachmentAssets) {
      await purgeAttachmentRecord(asset);
    }

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "DELETE",
      entity: "user",
      entityId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/users/delete] Error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
