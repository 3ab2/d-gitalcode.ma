import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

const replySchema = z.object({
  content: z.string().min(1).max(10000),
});

export async function POST(
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
    const data = replySchema.parse(body);

    const message = await prisma.clientMessage.findUnique({
      where: { id },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!message) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [reply] = await prisma.$transaction([
      prisma.messageReply.create({
        data: {
          messageId: id,
          adminId: session.user.id,
          content: data.content,
        },
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.clientMessage.update({
        where: { id },
        data: { status: "REPLIED" },
      }),
    ]);

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "REPLY",
      entity: "client_message",
      entityId: id,
      metadata: { clientEmail: message.user.email },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "validation_failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("[admin/messages/reply] Error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
