import type { SerializedNotification } from "./types";

/**
 * Future-ready delivery channels (push, email, PWA, SMS).
 * In-app notifications are persisted in the database first;
 * channels can subscribe to new records without refactoring business logic.
 */
export interface NotificationChannel {
  readonly name: string;
  deliver(notification: SerializedNotification, userId: string): Promise<void>;
}

const channels: NotificationChannel[] = [];

export function registerNotificationChannel(channel: NotificationChannel): void {
  channels.push(channel);
}

export async function dispatchToChannels(
  notification: SerializedNotification,
  userId: string
): Promise<void> {
  await Promise.allSettled(
    channels.map((channel) => channel.deliver(notification, userId))
  );
}
