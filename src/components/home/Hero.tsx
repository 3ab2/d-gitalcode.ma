"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodeRainCanvas } from "@/components/home/hero/CodeRainCanvas";
import { HeroIntroControls } from "@/components/home/hero/HeroIntroControls";
import { useHeroIntro } from "@/components/home/hero/useHeroIntro";
import { type Locale } from "@/lib/i18n/settings";

const HeroParticles = dynamic(
  () =>
    import("@/components/home/hero/HeroParticles").then((mod) => mod.HeroParticles),
  { ssr: false }
);

const HeroBrandPulse = dynamic(
  () =>
    import("@/components/home/hero/HeroBrandPulse").then((mod) => mod.HeroBrandPulse),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex h-10 w-10 shrink-0 rounded-full bg-brand-green/15 ring-1 ring-brand-green/30" />
    ),
  }
);

interface HeroProps {
  locale: Locale;
  stats: { key: string; value: string; label: string }[];
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero({ locale, stats }: HeroProps) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;
  const trustItems = t("hero.trust", { returnObjects: true }) as string[];

  const {
    hydrated,
    skipped,
    introComplete,
    animateIntro,
    reducedMotion: prefersReducedMotion,
    skipIntro,
  } = useHeroIntro();

  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion]);

  const showEffects = hydrated && !prefersReducedMotion;
  const motionReady = introComplete || skipped || prefersReducedMotion;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: motionReady ? 0 : 0.1,
        delayChildren: motionReady ? 0 : 0.55,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 1,
      y: motionReady ? 0 : 32,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: motionReady ? 0 : 0.8, ease: easeOut },
    },
  };

  return (
    <section className="hero-section hero-cinematic premium-grid">
      <div className="hero-cinematic-backdrop" aria-hidden>
        {showEffects && (
          <>
            <CodeRainCanvas active parallaxX={parallax.x} parallaxY={parallax.y} />
            <HeroParticles active />
          </>
        )}
        <div className="hero-cinematic-overlay" />
        <div className="hero-ambient">
          <div className="hero-ambient-glow -left-32 top-0 h-[30rem] w-[30rem] bg-brand-green/15 sm:-left-40 sm:h-[34rem] sm:w-[34rem]" />
          <div className="hero-ambient-glow -right-32 bottom-0 h-[24rem] w-[24rem] bg-brand-purple/12 sm:-right-40 sm:h-[28rem] sm:w-[28rem]" />
        </div>
      </div>

      <HeroIntroControls showSkip={hydrated && animateIntro} onSkip={skipIntro} />

      <div className="hero-content relative mx-auto flex w-full max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <motion.div
          className="flex flex-1 flex-col justify-center pt-8 sm:pt-10 lg:max-w-4xl lg:pt-0"
          variants={containerVariants}
          initial={motionReady ? "visible" : "hidden"}
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/[0.07] px-4 py-1.5 text-sm font-medium text-brand-green"
          >
            <Sparkles className="h-4 w-4" />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="hero-headline flex max-w-5xl items-center gap-4 text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white"
          >
            <HeroBrandPulse active={showEffects} />
            <span>{t("hero.brand")}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl lg:text-2xl lg:leading-snug"
          >
            {t("hero.headline")}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.ul
            variants={itemVariants}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            {Array.isArray(trustItems) &&
              trustItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green" />
                  {item}
                </li>
              ))}
          </motion.ul>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <Link href={`${basePath}/contact`} className="w-full sm:w-auto">
              <Button size="lg" className="hero-cta-glow min-h-12 w-full px-8 sm:w-auto">
                {t("hero.cta")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`${basePath}/services`} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="min-h-12 w-full px-8 sm:w-auto">
                {t("hero.ctaServices")}
              </Button>
            </Link>
            <Link href={`${basePath}/portfolio`} className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="min-h-12 w-full px-8 sm:w-auto">
                {t("hero.ctaSecondary")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-stats-row mt-10 border-t border-white/[0.08] pt-8 lg:mt-12"
          initial={prefersReducedMotion || motionReady ? false : { opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: prefersReducedMotion || motionReady ? 0 : 1,
            duration: 0.7,
            ease: easeOut,
          }}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.key} className="hero-stat-item">
                <div className="text-2xl font-bold text-brand-green sm:text-3xl lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs text-white/55 sm:text-sm">
                  {t(`hero.stats.${stat.key}` as "hero.stats.projects")}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
