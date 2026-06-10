import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import { notifyClientSupportReply } from "@/lib/notifications/events";

const replySchema = z.object({
  content: z.string().min(1).max(10000),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  try {
    const body = await request.json();
    const data = replySchema.parse(body);

    const latestMessage = await prisma.clientMessage.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestMessage) {
      return NextResponse.json({ error: "No conversation found" }, { status: 404 });
    }

    const [reply] = await prisma.$transaction([
      prisma.messageReply.create({
        data: {
          messageId: latestMessage.id,
          adminId: session.user.id,
          content: data.content,
        },
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.clientMessage.update({
        where: { id: latestMessage.id },
        data: { status: "REPLIED" },
      }),
    ]);

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "REPLY",
      entity: "client_message",
      entityId: latestMessage.id,
      metadata: { clientUserId: userId },
    });

    void notifyClientSupportReply({
      clientUserId: userId,
      messageId: latestMessage.id,
      replyId: reply.id,
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[admin/conversations/reply] Error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
