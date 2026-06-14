"use client";

import { Bell, User, FolderKanban, UserPlus } from "lucide-react";
import type { NotificationType } from "@prisma/client";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { SerializedNotification } from "@/lib/notifications/types";

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  NEW_LEAD: UserPlus,
  SYSTEM: Bell,
  ACCOUNT: User,
  PROJECT_UPDATE: FolderKanban,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  NEW_LEAD: "bg-brand-green/15 text-brand-green",
  SYSTEM: "bg-white/10 text-white/70",
  ACCOUNT: "bg-amber-400/15 text-amber-300",
  PROJECT_UPDATE: "bg-sky-400/15 text-sky-300",
};

export function NotificationItem({
  notification,
  localeTag,
  onClick,
}: {
  notification: SerializedNotification;
  localeTag: string;
  onClick: () => void;
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/[0.04]",
        !notification.isRead && "bg-brand-green/[0.04]"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          TYPE_COLORS[notification.type]
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-sm leading-snug",
              notification.isRead ? "text-white/75" : "font-medium text-white"
            )}
          >
            {notification.title}
          </span>
          {!notification.isRead && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
          )}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-white/45 line-clamp-2">
          {notification.message}
        </span>
        <time className="mt-1 block text-[10px] text-white/30 tabular-nums">
          {formatRelativeTime(notification.createdAt, localeTag)}
        </time>
      </span>
    </button>
  );
}
