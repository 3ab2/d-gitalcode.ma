"use client";

import { useTranslation } from "react-i18next";

/** First focusable element: lets keyboard users jump past the header. */
export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[10200] focus:rounded-lg focus:bg-brand-green focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-dark"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
