import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { submissionStatusSchema } from "@/lib/admin/schemas";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const submission = await prisma.contactSubmission.findUnique({
    where: { id },
    include: {
      service: true,
    },
  });

  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(submission);
}

export async function PATCH(
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
    const { status } = submissionStatusSchema.parse(body);

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "UPDATE",
      entity: "submission",
      entityId: id,
      metadata: { status },
    });

    return NextResponse.json(submission);
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
  await prisma.contactSubmission.delete({ where: { id } });

  await logAdminAction({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "DELETE",
    entity: "submission",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}
