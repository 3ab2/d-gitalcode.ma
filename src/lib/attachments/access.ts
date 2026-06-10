import { prisma } from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";

export async function canAccessAttachment(
  attachmentId: string,
  userId: string,
  role: string
): Promise<boolean> {
  if (isAdminRole(role)) return true;

  const attachment = await prisma.supportAttachment.findUnique({
    where: { id: attachmentId },
    include: {
      message: { select: { userId: true } },
      reply: {
        select: {
          message: { select: { userId: true } },
        },
      },
    },
  });

  if (!attachment) return false;

  if (attachment.message?.userId === userId) return true;
  if (attachment.reply?.message.userId === userId) return true;

  return false;
}
