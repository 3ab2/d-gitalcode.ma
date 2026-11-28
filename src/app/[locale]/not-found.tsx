"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { buttonClasses } from "@/components/ui/Button";
import { defaultLocale, isValidLocale } from "@/lib/i18n/settings";

/** not-found files receive no params, so the language comes from the URL. */
export default function NotFound() {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale?: string }>();
  const home = locale && isValidLocale(locale) ? locale : defaultLocale;

  return (
    <section className="container-site flex min-h-[60vh] flex-col justify-center py-24">
      <p className="font-mono text-sm text-accent-ink">404</p>
      <h1 className="mt-4 max-w-[18ch] text-title text-ink">{t("notFound.title")}</h1>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/${home}`} className={buttonClasses("primary", "lg")}>
          {t("notFound.back")}
        </Link>
        <Link href={`/${home}/contact`} className={buttonClasses("outline", "lg")}>
          {t("nav.contact")}
        </Link>
      </div>
    </section>
  );
}
