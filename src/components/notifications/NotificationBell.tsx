"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { cn } from "@/lib/utils";

export function NotificationBell({
  localeTag = "fr-FR",
  className,
}: {
  localeTag?: string;
  className?: string;
}) {
  const { status } = useSession();
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile || !open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, isMobile]);

  if (status !== "authenticated") return null;

  return (
    <>
      <div ref={containerRef} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10",
            "text-white/70 transition-colors hover:border-brand-green/30 hover:bg-white/5 hover:text-brand-green",
            open && "border-brand-green/30 bg-brand-green/10 text-brand-green"
          )}
          aria-label={t("notifications.title")}
          aria-expanded={open}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-green px-1 text-[9px] font-bold text-brand-dark">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {!isMobile && (
          <NotificationCenter
            open={open}
            onClose={() => setOpen(false)}
            localeTag={localeTag}
            variant="dropdown"
          />
        )}
      </div>

      {isMobile && (
        <NotificationCenter
          open={open}
          onClose={() => setOpen(false)}
          localeTag={localeTag}
          variant="drawer"
        />
      )}
    </>
  );
}
