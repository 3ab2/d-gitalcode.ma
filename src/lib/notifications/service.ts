import type { NotificationType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dispatchToChannels } from "./channels";
import type {
  NotificationListResponse,
  NotificationMetadata,
  SerializedNotification,
} from "./types";

const PAGE_SIZE = 20;

export function serializeNotification(
  row: {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    metadata: Prisma.JsonValue;
    createdAt: Date;
  }
): SerializedNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    isRead: row.isRead,
    metadata: (row.metadata as NotificationMetadata | null) ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: NotificationMetadata;
}): Promise<SerializedNotification> {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });

  const serialized = serializeNotification(notification);
  void dispatchToChannels(serialized, input.userId);
  return serialized;
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function listNotifications(
  userId: string,
  options?: { cursor?: string; limit?: number }
): Promise<NotificationListResponse> {
  const limit = options?.limit ?? PAGE_SIZE;

  const items = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(options?.cursor
      ? {
          cursor: { id: options.cursor },
          skip: 1,
        }
      : {}),
  });

  const hasMore = items.length > limit;
  const page = hasMore ? items.slice(0, limit) : items;
  const unreadCount = await getUnreadCount(userId);

  return {
    items: page.map(serializeNotification),
    nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
    unreadCount,
  };
}

export async function markNotificationRead(
  userId: string,
  notificationId: string
): Promise<boolean> {
  const result = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
  return result.count > 0;
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  return result.count;
}

export async function getNotificationsSince(
  userId: string,
  since: Date
): Promise<SerializedNotification[]> {
  const rows = await prisma.notification.findMany({
    where: {
      userId,
      createdAt: { gt: since },
    },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(serializeNotification);
}
