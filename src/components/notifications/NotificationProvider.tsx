"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import type { SerializedNotification } from "@/lib/notifications/types";

type NotificationContextValue = {
  notifications: SerializedNotification[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const enabled = status === "authenticated";

  const [notifications, setNotifications] = useState<SerializedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchPage = useCallback(async (cursor?: string) => {
    const url = cursor
      ? `/api/notifications?cursor=${encodeURIComponent(cursor)}`
      : "/api/notifications";
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json() as Promise<{
      items: SerializedNotification[];
      nextCursor: string | null;
      unreadCount: number;
    }>;
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await fetchPage();
      if (data) {
        setNotifications(data.items);
        setNextCursor(data.nextCursor);
        setUnreadCount(data.unreadCount);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, fetchPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || !enabled) return;
    const data = await fetchPage(nextCursor);
    if (data) {
      setNotifications((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
      setUnreadCount(data.unreadCount);
    }
  }, [nextCursor, enabled, fetchPage]);

  const markAsRead = useCallback(async (id: string) => {
    const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    if (!res.ok) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    const res = await fetch("/api/notifications/read-all", { method: "POST" });
    if (!res.ok) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (enabled) {
      void (async () => {
        setLoading(true);
        try {
          const data = await fetchPage();
          if (cancelled || !data) return;
          setNotifications(data.items);
          setNextCursor(data.nextCursor);
          setUnreadCount(data.unreadCount);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    } else {
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        setNotifications([]);
        setUnreadCount(0);
        setNextCursor(null);
      }, 0);

      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [enabled, fetchPage]);

  const handleConnected = useCallback((count: number) => {
    if (mountedRef.current) setUnreadCount(count);
  }, []);

  const handleUnreadCount = useCallback((count: number) => {
    if (mountedRef.current) setUnreadCount(count);
  }, []);

  const handleNotification = useCallback((notification: SerializedNotification) => {
    if (!mountedRef.current) return;
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
    if (!notification.isRead) {
      setUnreadCount((c) => c + 1);
    }
  }, []);

  const handleFallback = useCallback(() => {
    if (mountedRef.current) void refresh();
  }, [refresh]);

  useNotificationStream(enabled, {
    onConnected: handleConnected,
    onUnreadCount: handleUnreadCount,
    onNotification: handleNotification,
    onFallback: handleFallback,
  });

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      hasMore: Boolean(nextCursor),
      loadMore,
      refresh,
      markAsRead,
      markAllAsRead,
    }),
    [
      notifications,
      unreadCount,
      loading,
      nextCursor,
      loadMore,
      refresh,
      markAsRead,
      markAllAsRead,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
