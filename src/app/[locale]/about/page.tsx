import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Code2,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale as Locale);
  return {
    title: t("about.meta.title"),
    description: t("about.meta.description"),
  };
}

const valueIcons = [Heart, Zap, Users, CheckCircle2];
const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "WordPress",
  "WooCommerce",
  "React Native",
  "Flutter",
  "TailwindCSS",
  "Prisma",
  "Cloudinary",
];

async function getStats() {
  try {
    return await prisma.siteStat.findMany();
  } catch {
    return [
      { key: "projects", value: "50+" },
      { key: "clients", value: "30+" },
      { key: "technologies", value: "20+" },
      { key: "support", value: "24/7" },
    ];
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale as Locale);
  const stats = await getStats();
  const basePath = `/${locale}`;

  const values = ["quality", "innovation", "partnership", "transparency"] as const;
  const whyItems = ["expertise", "support", "delivery", "pricing"] as const;

  return (
    <div className="premium-grid">
      <section className="relative overflow-x-clip pt-10 pb-16 md:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-green/[0.06] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="green" className="mb-6">
              {t("about.hero.badge")}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {t("about.hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/60">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">{t("about.story.title")}</h2>
              <p className="mt-6 text-white/60 leading-relaxed">{t("about.story.p1")}</p>
              <p className="mt-4 text-white/60 leading-relaxed">{t("about.story.p2")}</p>
            </div>
            <GlassCard>
              <h3 className="text-xl font-semibold text-white">{t("about.intro.title")}</h3>
              <p className="mt-4 text-white/60 leading-relaxed">{t("about.intro.desc")}</p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard>
              <Target className="h-8 w-8 text-brand-green" />
              <h3 className="mt-4 text-xl font-semibold text-white">{t("about.mission.title")}</h3>
              <p className="mt-3 text-white/60 leading-relaxed">{t("about.mission.desc")}</p>
            </GlassCard>
            <GlassCard>
              <Eye className="h-8 w-8 text-brand-purple" />
              <h3 className="mt-4 text-xl font-semibold text-white">{t("about.vision.title")}</h3>
              <p className="mt-3 text-white/60 leading-relaxed">{t("about.vision.desc")}</p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-white">{t("about.values.title")}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((key, i) => {
              const Icon = valueIcons[i] || Heart;
              return (
                <GlassCard key={key} className="text-center">
                  <Icon className="mx-auto h-8 w-8 text-brand-green" />
                  <h3 className="mt-4 font-semibold text-white">{t(`about.values.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-white/55">{t(`about.values.${key}.desc`)}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Code2 className="mx-auto h-10 w-10 text-brand-green" />
            <h2 className="mt-4 text-3xl font-bold text-white">{t("about.tech.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">{t("about.tech.subtitle")}</p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-white">{t("about.why.title")}</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {whyItems.map((key) => (
              <div key={key} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-green" />
                <div>
                  <h3 className="font-semibold text-white">{t(`about.why.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-white/55">{t(`about.why.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center"
              >
                <div className="text-3xl font-bold text-brand-green">{stat.value}</div>
                <div className="mt-2 text-sm text-white/50">
                  {t(`hero.stats.${stat.key}` as "hero.stats.projects")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <GlassCard className="py-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t("about.cta.title")}</h2>
            <p className="mt-4 text-white/60">{t("about.cta.subtitle")}</p>
            <Link href={`${basePath}/contact`} className="mt-8 inline-block">
              <Button size="lg">
                {t("about.cta.button")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
