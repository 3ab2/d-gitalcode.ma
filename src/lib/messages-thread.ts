import { prisma } from "@/lib/prisma";

export type ThreadItem =
  | {
      type: "client";
      id: string;
      content: string;
      createdAt: Date;
      messageId: string;
    }
  | {
      type: "admin";
      id: string;
      content: string;
      createdAt: Date;
      messageId: string;
      adminName: string | null;
    };

export function buildThreadFromMessages(
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    replies: Array<{
      id: string;
      content: string;
      createdAt: Date;
      admin: { name: string | null };
    }>;
  }>
): ThreadItem[] {
  const items: ThreadItem[] = [];

  for (const message of messages) {
    items.push({
      type: "client",
      id: `msg-${message.id}`,
      content: message.content,
      createdAt: message.createdAt,
      messageId: message.id,
    });

    for (const reply of message.replies) {
      items.push({
        type: "admin",
        id: `reply-${reply.id}`,
        content: reply.content,
        createdAt: reply.createdAt,
        messageId: message.id,
        adminName: reply.admin.name,
      });
    }
  }

  return items.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export type ClientConversationStatus = "open" | "waiting" | "replied";

export interface ClientThreadMeta {
  status: ClientConversationStatus;
  lastActivityAt: string | null;
  lastSupportReplyAt: string | null;
  unreadCount: number;
}

export async function getClientThread(userId: string) {
  const { thread } = await getClientThreadWithMeta(userId);
  return thread;
}

export async function getClientThreadWithMeta(userId: string) {
  const messages = await prisma.clientMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
        include: { admin: { select: { name: true } } },
      },
    },
  });

  const thread = buildThreadFromMessages(messages);
  const lastItem = thread.at(-1) ?? null;
  const lastAdmin = [...thread].reverse().find((item) => item.type === "admin") ?? null;

  let status: ClientConversationStatus = "open";
  if (thread.length > 0) {
    status = lastItem?.type === "admin" ? "replied" : "waiting";
  }

  const unreadCount = messages.filter(
    (message) => message.status === "OPEN" && message.replies.length > 0
  ).length;

  return {
    thread,
    meta: {
      status,
      lastActivityAt: lastItem ? new Date(lastItem.createdAt).toISOString() : null,
      lastSupportReplyAt: lastAdmin
        ? new Date(lastAdmin.createdAt).toISOString()
        : null,
      unreadCount,
    } satisfies ClientThreadMeta,
  };
}

export interface ConversationSummary {
  userId: string;
  user: { id: string; name: string | null; email: string };
  lastPreview: string;
  lastActivityAt: Date;
  unreadCount: number;
  messageCount: number;
}

export async function getAdminConversations(): Promise<ConversationSummary[]> {
  const messages = await prisma.clientMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      replies: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const map = new Map<string, ConversationSummary>();

  for (const message of messages) {
    const existing = map.get(message.userId);
    const preview = message.content.slice(0, 120);
    const activityAt = message.replies[0]?.createdAt ?? message.createdAt;
    const isUnread = message.status === "OPEN";

    if (!existing) {
      map.set(message.userId, {
        userId: message.userId,
        user: message.user,
        lastPreview: preview,
        lastActivityAt: activityAt,
        unreadCount: isUnread ? 1 : 0,
        messageCount: 1,
      });
      continue;
    }

    existing.messageCount += 1;
    if (isUnread) existing.unreadCount += 1;
    if (activityAt > existing.lastActivityAt) {
      existing.lastActivityAt = activityAt;
      existing.lastPreview = preview;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime()
  );
}
