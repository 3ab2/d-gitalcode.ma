import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";

const createMessageSchema = z.object({
  subject: z.string().min(2).max(200).optional(),
  content: z.string().min(1).max(10000),
});

export async function POST(request: NextRequest) {
  const session = await requireClient();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createMessageSchema.parse(body);

    const message = await prisma.clientMessage.create({
      data: {
        userId: session.user.id,
        subject: data.subject ?? "Support request",
        content: data.content,
        status: "OPEN",
      },
      include: {
        replies: true,
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "validation_failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("[messages] Create error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
