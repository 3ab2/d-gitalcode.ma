"use client";

import { FastForward } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeroIntroControls({
  showSkip,
  onSkip,
}: {
  showSkip: boolean;
  onSkip: () => void;
}) {
  const { t } = useTranslation();

  if (!showSkip) return null;

  return (
    <div className="hero-intro-controls pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-end px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onSkip}
        className="pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs font-medium text-white/75 backdrop-blur-sm transition-colors hover:border-brand-green/30 hover:text-brand-green"
      >
        <FastForward className="h-4 w-4" />
        {t("hero.skipIntro")}
      </button>
    </div>
  );
}
