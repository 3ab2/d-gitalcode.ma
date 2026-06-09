"use client";

import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/lib/utils";

type PwaInstallButtonProps = {
  variant?: "icon" | "menu" | "pill";
  className?: string;
  onInstalled?: () => void;
};

export function PwaInstallButton({
  variant = "pill",
  className,
  onInstalled,
}: PwaInstallButtonProps) {
  const { t } = useTranslation();
  const { canInstall, install } = usePwaInstall();

  if (!canInstall) return null;

  const handleClick = async () => {
    const ok = await install();
    if (ok) onInstalled?.();
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10",
          "text-white/70 transition-colors hover:border-brand-green/30 hover:bg-white/5 hover:text-brand-green",
          className
        )}
        aria-label={t("pwa.install")}
        title={t("pwa.install")}
      >
        <Download className="h-4 w-4" />
      </button>
    );
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex min-h-11 w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80",
          "transition-colors hover:bg-white/5 hover:text-brand-green",
          className
        )}
      >
        <Download className="h-4 w-4 shrink-0" />
        {t("pwa.install")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-brand-green/25 bg-brand-green/10",
        "px-3 py-2 text-xs font-semibold text-brand-green transition hover:bg-brand-green/15",
        className
      )}
    >
      <Download className="h-3.5 w-3.5" />
      {t("pwa.install")}
    </button>
  );
}
