"use client";

import { useEffect, useRef } from "react";
import type { SerializedNotification } from "@/lib/notifications/types";

type StreamHandlers = {
  onNotification?: (notification: SerializedNotification) => void;
  onUnreadCount?: (count: number) => void;
  onConnected?: (unreadCount: number) => void;
  onFallback?: () => void;
};

export function useNotificationStream(
  enabled: boolean,
  handlers: StreamHandlers
) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!enabled) return;

    let es: EventSource | null = null;
    let fallbackTimer: number | null = null;
    let connected = false;

    const startFallback = () => {
      if (fallbackTimer) return;
      handlersRef.current.onFallback?.();
      fallbackTimer = window.setInterval(() => {
        handlersRef.current.onFallback?.();
      }, 10000);
    };

    try {
      es = new EventSource("/api/notifications/stream", {
        withCredentials: true,
      });

      es.onopen = () => {
        connected = true;
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as {
            type: string;
            notification?: SerializedNotification;
            count?: number;
            unreadCount?: number;
          };

          if (data.type === "connected" && typeof data.unreadCount === "number") {
            handlersRef.current.onConnected?.(data.unreadCount);
          }
          if (data.type === "notification" && data.notification) {
            handlersRef.current.onNotification?.(data.notification);
          }
          if (data.type === "unread_count" && typeof data.count === "number") {
            handlersRef.current.onUnreadCount?.(data.count);
          }
        } catch {
          /* ignore malformed events */
        }
      };

      es.onerror = () => {
        es?.close();
        es = null;
        if (!connected) startFallback();
      };
    } catch {
      startFallback();
    }

    const connectTimeout = window.setTimeout(() => {
      if (!connected) startFallback();
    }, 5000);

    return () => {
      window.clearTimeout(connectTimeout);
      if (fallbackTimer) window.clearInterval(fallbackTimer);
      es?.close();
    };
  }, [enabled]);
}
