"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupportPath, resolveLocaleFromPathname } from "@/lib/auth-urls";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { cn } from "@/lib/utils";
import type { SerializedNotification } from "@/lib/notifications/types";

function groupNotifications(items: SerializedNotification[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups: { key: string; items: SerializedNotification[] }[] = [];
  const map = new Map<string, SerializedNotification[]>();

  for (const item of items) {
    const date = new Date(item.createdAt);
    date.setHours(0, 0, 0, 0);
    let key = "earlier";
    if (date.getTime() === today.getTime()) key = "today";
    else if (date.getTime() === yesterday.getTime()) key = "yesterday";

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }

  for (const key of ["today", "yesterday", "earlier"]) {
    const group = map.get(key);
    if (group?.length) groups.push({ key, items: group });
  }

  return groups;
}

export function NotificationCenter({
  open,
  onClose,
  localeTag,
  variant = "dropdown",
}: {
  open: boolean;
  onClose: () => void;
  localeTag: string;
  variant?: "dropdown" | "drawer";
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const listRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => groupNotifications(notifications), [notifications]);

  const groupLabel = (key: string) => {
    if (key === "today") return t("notifications.today");
    if (key === "yesterday") return t("notifications.yesterday");
    return t("notifications.earlier");
  };

  const handleClick = async (notification: SerializedNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    let href = notification.metadata?.href;
    if (href === "support") {
      const locale =
        (notification.metadata?.locale as string | undefined) ??
        resolveLocaleFromPathname(pathname);
      href = getSupportPath(locale);
    }
    if (href) {
      router.push(href);
      onClose();
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const panelContent = (
    <>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand-green" />
          <h2 className="text-sm font-semibold text-white">
            {t("notifications.title")}
          </h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-brand-green/15 px-2 py-0.5 text-[10px] font-bold text-brand-green">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllAsRead()}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-white/50 hover:bg-white/5 hover:text-white"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {t("notifications.markAllRead")}
            </button>
          )}
          {variant === "drawer" && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/5"
              aria-label={t("notifications.close")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={listRef}
        className="max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain p-2"
        onScroll={() => {
          const el = listRef.current;
          if (!el || !hasMore || loading) return;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) {
            void loadMore();
          }
        }}
      >
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Bell className="mx-auto h-8 w-8 text-white/20" />
            <p className="mt-3 text-sm text-white/40">{t("notifications.empty")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.key}>
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  {groupLabel(group.key)}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NotificationItem
                      key={item.id}
                      notification={item}
                      localeTag={localeTag}
                      onClick={() => void handleClick(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {hasMore && (
              <p className="py-2 text-center text-[10px] text-white/30">
                {t("notifications.loadMore")}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (variant === "drawer") {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label={t("notifications.close")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/60"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 right-0 z-[9999] flex w-full max-w-sm flex-col border-l border-white/10 bg-brand-dark shadow-2xl"
            >
              {panelContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-white/10 bg-brand-dark/98 shadow-2xl shadow-black/40 backdrop-blur-xl",
        "notification-panel-animate"
      )}
    >
      {panelContent}
    </div>
  );
}
