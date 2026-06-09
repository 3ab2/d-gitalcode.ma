import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { isDeliverableClientEmail, sendReplyEmail } from "@/lib/email";
import { logAdminAction } from "@/lib/audit";

const replySchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(5),
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

    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isDeliverableClientEmail(submission.email)) {
      return NextResponse.json(
        {
          error: "invalid_recipient",
          message:
            "This submission has no valid client email (e.g. WhatsApp-only request).",
        },
        { status: 422 }
      );
    }

    const reply = await prisma.submissionReply.create({
      data: {
        submissionId: id,
        subject: data.subject,
        message: data.message,
        sentTo: submission.email,
        status: "PENDING",
        sentBy: session.user.email ?? undefined,
      },
    });

    const emailResult = await sendReplyEmail({
      to: submission.email,
      subject: data.subject,
      message: data.message,
      clientName: submission.name,
    });

    const errorInfo = emailResult.success
      ? null
      : emailResult.error ?? emailResult.reason;

    const updatedReply = await prisma.submissionReply.update({
      where: { id: reply.id },
      data: {
        status: emailResult.success ? "SENT" : "FAILED",
        error: errorInfo,
      },
    });

    if (emailResult.success) {
      await prisma.contactSubmission.update({
        where: { id },
        data: { status: "REPLIED" },
      });
    }

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "REPLY",
      entity: "submission",
      entityId: id,
      metadata: {
        subject: data.subject,
        emailStatus: updatedReply.status,
        sentTo: submission.email,
        error: errorInfo,
      },
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          ...updatedReply,
          emailSent: false,
          error: emailResult.reason,
          message: errorInfo,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ...updatedReply,
      emailSent: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[reply] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
