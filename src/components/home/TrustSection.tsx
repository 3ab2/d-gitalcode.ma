"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Shield, Zap, Users, Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { type Locale } from "@/lib/i18n/settings";

const icons = [Shield, Zap, Users, Award];

export function TrustSection({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;
  const items = t("home.trust.items", { returnObjects: true }) as {
    title: string;
    desc: string;
  }[];

  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("home.trust.title")}
          subtitle={t("home.trust.subtitle")}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.isArray(items) &&
            items.map((item, index) => {
              const Icon = icons[index] || Shield;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-brand-card/40 p-6 text-center sm:text-left"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green sm:mx-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{item.desc}</p>
                </div>
              );
            })}
        </div>
        <p className="mt-10 text-center text-sm text-white/60">
          {t("home.trust.footer")}{" "}
          <Link href={`${basePath}/about`} className="text-brand-green underline underline-offset-4">
            {t("home.about.cta")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
