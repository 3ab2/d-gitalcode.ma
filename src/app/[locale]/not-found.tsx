"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { defaultLocale, isValidLocale } from "@/lib/i18n/settings";

/** not-found files receive no params, so the language comes from the URL. */
export default function NotFound() {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale?: string }>();
  const home = locale && isValidLocale(locale) ? locale : defaultLocale;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-green">404</p>
      <h1 className="mt-4 text-xl text-white/80">{t("notFound.title")}</h1>
      <Link
        href={`/${home}`}
        className="mt-8 inline-flex min-h-11 items-center text-brand-green underline underline-offset-4"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}
