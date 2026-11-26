"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { buttonClasses } from "@/components/ui/Button";
import { type Locale } from "@/lib/i18n/settings";

export function AboutPreviewSection({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;
  const items = ["mission", "vision", "why"] as const;

  return (
    <section id="about" className="section-y border-t border-line">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 className="max-w-[16ch] text-heading text-ink">{t("home.about.title")}</h2>
          <p className="mt-5 text-lead text-ink-2">{t("home.about.subtitle")}</p>
          <p className="mt-5 max-w-md text-ink-2">{t("home.about.intro")}</p>
          <Link href={`${basePath}/about`} className={buttonClasses("outline", "md", "mt-9")}>
            {t("home.about.cta")}
          </Link>
        </div>

        <dl className="divide-y divide-line border-y border-line lg:col-span-6 lg:col-start-7">
          {items.map((key) => (
            <div key={key} className="grid gap-2 py-8 sm:grid-cols-3 sm:gap-8">
              <dt className="font-medium text-ink">{t(`home.about.${key}.title`)}</dt>
              <dd className="text-ink-2 sm:col-span-2">{t(`home.about.${key}.desc`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
