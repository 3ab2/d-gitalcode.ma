import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sendReplyEmail } from "@/lib/email";
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

    const updatedReply = await prisma.submissionReply.update({
      where: { id: reply.id },
      data: {
        status: emailResult.success ? "SENT" : "FAILED",
        error: emailResult.success ? null : String(emailResult.reason || emailResult.error),
      },
    });

    await prisma.contactSubmission.update({
      where: { id },
      data: { status: "REPLIED" },
    });

    await logAdminAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "REPLY",
      entity: "submission",
      entityId: id,
      metadata: { subject: data.subject, emailStatus: updatedReply.status },
    });

    return NextResponse.json(updatedReply);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
