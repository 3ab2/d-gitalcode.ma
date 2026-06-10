import { prisma } from "@/lib/prisma";
import { createNotification } from "./service";

export async function notifyClientSupportReply(input: {
  clientUserId: string;
  messageId: string;
  replyId: string;
  locale?: string;
}) {
  const locale = input.locale ?? "fr";
  await createNotification({
    userId: input.clientUserId,
    type: "SUPPORT_REPLY",
    title: "Support D-GITALCODE",
    message: "You have received a new support reply.",
    metadata: {
      messageId: input.messageId,
      replyId: input.replyId,
      href: "support",
      locale,
    },
  });
}

export async function notifyAdminsNewMessage(input: {
  messageId: string;
  clientUserId: string;
  clientName?: string | null;
}) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  if (admins.length === 0) return;

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin.id,
        type: "NEW_MESSAGE",
        title: "New support conversation",
        message: "A client has sent a new message.",
        metadata: {
          messageId: input.messageId,
          clientUserId: input.clientUserId,
          clientName: input.clientName ?? undefined,
          href: `/admin/messages?user=${input.clientUserId}`,
        },
      })
    )
  );
}
