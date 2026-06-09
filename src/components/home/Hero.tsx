"use client";

import Link from "next/link";
import { HeroIllustration } from "@/components/brand/HeroIllustration";
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { type Locale } from "@/lib/i18n/settings";

interface HeroProps {
  locale: Locale;
  stats: { key: string; value: string; label: string }[];
}

export function Hero({ locale, stats }: HeroProps) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;
  const trustItems = t("hero.trust", { returnObjects: true }) as string[];

  return (
    <section className="hero-section premium-grid">
      {/* Layer 0 — ambient glows (green + blue, max ~25% opacity) */}
      <div className="hero-ambient" aria-hidden>
        <div className="hero-ambient-glow -left-32 top-0 h-[26rem] w-[26rem] bg-brand-green/25 sm:-left-40 sm:top-10 sm:h-[28rem] sm:w-[28rem]" />
        <div className="hero-ambient-glow -right-32 bottom-0 h-[22rem] w-[22rem] bg-brand-purple/20 sm:-right-40 sm:bottom-10 sm:h-[24rem] sm:w-[24rem]" />
        <div className="hero-ambient-glow left-1/2 top-1/3 h-[18rem] w-[36rem] -translate-x-1/2 bg-brand-green/10" />
      </div>

      {/* Layer 10 — all readable content sits above backgrounds */}
      <div className="hero-content mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="hero-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/25 bg-brand-green/15 px-4 py-1.5 text-sm font-medium text-brand-green">
              <Sparkles className="h-4 w-4" />
              {t("hero.badge")}
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
              {t("hero.brand")}
            </p>

            <h1 className="hero-headline mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
              {t("hero.headline")}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              {t("hero.subtitle")}
            </p>

            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {Array.isArray(trustItems) &&
                trustItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-white/85"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green" />
                    {item}
                  </li>
                ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`${basePath}/contact`}>
                <Button size="lg" className="min-h-12 px-8">
                  {t("hero.cta")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`${basePath}/portfolio`}>
                <Button variant="outline" size="lg" className="min-h-12 px-8">
                  {t("hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="hero-fade-in-delay flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </div>

        <div className="hero-fade-in-delay mt-14 lg:mt-20">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-center backdrop-blur-sm sm:p-6"
              >
                <div className="text-2xl font-bold text-brand-green sm:text-3xl lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs text-white/70 sm:text-sm">
                  {t(`hero.stats.${stat.key}` as "hero.stats.projects")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
