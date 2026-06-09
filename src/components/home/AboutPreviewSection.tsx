"use client";

import Link from "next/link";
import { Target, Eye, Shield, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { type Locale } from "@/lib/i18n/settings";

export function AboutPreviewSection({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;

  const cards = [
    { key: "mission", icon: Target },
    { key: "vision", icon: Eye },
    { key: "why", icon: Shield },
  ] as const;

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("home.about.title")}
          subtitle={t("home.about.subtitle")}
        />

        <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-white/60">
          {t("home.about.intro")}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map(({ key, icon: Icon }) => (
            <GlassCard key={key} className="text-center md:text-start">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 text-brand-green md:mx-0">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                {t(`home.about.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {t(`home.about.${key}.desc`)}
              </p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href={`${basePath}/about`}>
            <Button variant="outline" size="lg">
              {t("home.about.cta")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
