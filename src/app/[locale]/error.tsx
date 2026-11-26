"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.error("[page-error]", error);
  }, [error]);

  const locale = i18n.language || "fr";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple/15 text-brand-purple">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-white">
          {t("pageError.title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {t("pageError.description")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" onClick={reset}>
            {t("pageError.retry")}
          </Button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-brand-green/40 hover:text-brand-green"
          >
            {t("pageError.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
