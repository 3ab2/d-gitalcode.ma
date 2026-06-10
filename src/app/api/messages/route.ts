import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";
import {
  AttachmentValidationError,
  saveMessageAttachments,
} from "@/lib/attachments/service";
import { validateAttachmentCount } from "@/lib/attachments/validation";
import { notifyAdminsNewMessage } from "@/lib/notifications/events";

const createMessageSchema = z.object({
  subject: z.string().min(2).max(200).optional(),
  content: z.string().max(10000).optional().default(""),
});

async function parseMessageRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const content = String(formData.get("content") ?? "").trim();
    const subject = formData.get("subject");
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    validateAttachmentCount(files.length);

    const data = createMessageSchema.parse({
      content,
      subject: subject ? String(subject) : undefined,
    });

    if (!data.content && files.length === 0) {
      throw new z.ZodError([
        {
          code: "custom",
          message: "Message content or at least one attachment is required",
          path: ["content"],
        },
      ]);
    }

    return { data, files };
  }

  const body = await request.json();
  const data = createMessageSchema.parse(body);

  if (!data.content?.trim()) {
    throw new z.ZodError([
      {
        code: "custom",
        message: "Message content is required",
        path: ["content"],
      },
    ]);
  }

  return { data: { ...data, content: data.content.trim() }, files: [] as File[] };
}

export async function POST(request: NextRequest) {
  const session = await requireClient();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, files } = await parseMessageRequest(request);

    const message = await prisma.clientMessage.create({
      data: {
        userId: session.user.id,
        subject: data.subject ?? "Support request",
        content: data.content || " ",
        status: "OPEN",
      },
    });

    const attachments = await saveMessageAttachments(
      message.id,
      session.user.id,
      files
    );

    void notifyAdminsNewMessage({
      messageId: message.id,
      clientUserId: session.user.id,
      clientName: session.user.name,
    });

    const result = await prisma.clientMessage.findUnique({
      where: { id: message.id },
      include: {
        replies: true,
        attachments: {
          include: { uploadedBy: { select: { name: true } } },
        },
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json(
      { ...result, attachments },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "validation_failed", details: error.issues },
        { status: 400 }
      );
    }
    if (error instanceof AttachmentValidationError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: 400 }
      );
    }
    console.error("[messages] Create error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
