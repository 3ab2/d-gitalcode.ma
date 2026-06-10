"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Download, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePwaInstall } from "@/components/pwa/PwaInstallProvider";
import { cn } from "@/lib/utils";

export function UserMenu({
  label,
  profileHref,
  onLogout,
  className,
}: {
  label: string;
  profileHref: string;
  onLogout: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const { canInstall, installMode, openInstallModal, install } = usePwaInstall();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const handleInstall = async () => {
    setOpen(false);
    if (installMode === "ios") {
      openInstallModal();
      return;
    }
    const ok = await install();
    if (!ok) openInstallModal();
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-xl border border-white/10 px-2.5",
          "text-white/70 transition-colors hover:border-brand-green/30 hover:bg-white/5 hover:text-brand-green",
          open && "border-brand-green/30 bg-brand-green/10 text-brand-green"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
          <User className="h-4 w-4" />
        </span>
        <ChevronDown
          className={cn("hidden h-3.5 w-3.5 transition-transform sm:block", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[120] min-w-[12rem] overflow-hidden rounded-xl border border-white/10 bg-brand-dark/98 py-1 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <Link
            href={profileHref}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
          >
            <User className="h-4 w-4 shrink-0 text-white/40" />
            <span className="truncate">{label}</span>
          </Link>

          {canInstall && (
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleInstall()}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-brand-green transition-colors hover:bg-brand-green/10"
            >
              <Download className="h-4 w-4 shrink-0" />
              {t("pwa.menuInstall")}
            </button>
          )}

          <div className="my-1 border-t border-white/10" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-white/55 transition-colors hover:bg-red-400/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
