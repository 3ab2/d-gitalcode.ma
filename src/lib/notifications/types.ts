import type { NotificationType } from "@prisma/client";

export type NotificationMetadata = {
  messageId?: string;
  replyId?: string;
  clientUserId?: string;
  clientName?: string;
  href?: string;
  [key: string]: unknown;
};

export type SerializedNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata: NotificationMetadata | null;
  createdAt: string;
};

export type NotificationListResponse = {
  items: SerializedNotification[];
  nextCursor: string | null;
  unreadCount: number;
};
