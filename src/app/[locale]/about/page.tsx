import type { Metadata } from "next";
import Link from "next/link";
import { verifiedStats } from "@/config/verified-facts";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { buttonClasses } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  return buildPublicPageMetadata({
    locale: loc,
    path: "about",
    title: t("about.meta.title"),
    description: t("about.meta.description"),
  });
}

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
    return verifiedStats(await prisma.siteStat.findMany());
  } catch {
    return [];
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
    <>
      <PageHero title={t("about.hero.title")} lead={t("about.hero.subtitle")} />

      <section className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="text-heading text-ink">{t("about.story.title")}</h2>
            <p className="mt-6 max-w-2xl text-lead text-ink-2">{t("about.story.p1")}</p>
            <p className="mt-5 max-w-2xl text-ink-2">{t("about.story.p2")}</p>
          </div>
          <aside className="border-t border-line pt-8 lg:col-span-4 lg:col-start-9 lg:border-s lg:border-t-0 lg:ps-10 lg:pt-0">
            <h3 className="font-medium text-ink">{t("about.intro.title")}</h3>
            <p className="mt-3 text-ink-2">{t("about.intro.desc")}</p>
          </aside>
        </div>
      </section>

      <section className="section-y border-t border-line">
        <div className="container-site">
          <dl className="grid gap-12 md:grid-cols-2 md:gap-10">
            {(["mission", "vision"] as const).map((key) => (
              <div key={key} className="relative border-t border-line pt-8">
                <span aria-hidden className="absolute -top-px start-0 h-0.5 w-10 bg-accent" />
                <dt className="text-subheading text-ink">{t(`about.${key}.title`)}</dt>
                <dd className="mt-4 max-w-lg text-lead text-ink-2">{t(`about.${key}.desc`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y border-t border-line">
        <div className="container-site">
          <SectionHeading title={t("about.values.title")} align="left" />
          <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((key) => (
              <div key={key} className="border-t border-line pt-6">
                <dt className="font-medium text-ink">{t(`about.values.${key}.title`)}</dt>
                <dd className="mt-3 text-ink-2">{t(`about.values.${key}.desc`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y border-t border-line bg-surface/40">
        <div className="container-site">
          <SectionHeading title={t("about.tech.title")} subtitle={t("about.tech.subtitle")} />
          <ul className="mt-12 flex flex-wrap gap-2.5">
            {techStack.map((tech) => (
              <li key={tech} className="rounded-md border border-line-strong px-3.5 py-2 font-mono text-sm text-ink-2">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-t border-line">
        <div className="container-site">
          <SectionHeading title={t("about.why.title")} align="left" />
          <dl className="mt-14 grid border-t border-line md:grid-cols-2">
            {whyItems.map((key, index) => (
              <div
                key={key}
                className={`border-b border-line py-8 ${index % 2 === 0 ? "md:pe-10" : "md:border-s md:ps-10"}`}
              >
                <dt className="font-medium text-ink">{t(`about.why.${key}.title`)}</dt>
                <dd className="mt-2 text-ink-2">{t(`about.why.${key}.desc`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site">
            <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.key} className="border-t border-line pt-6">
                  <dt className="text-sm text-ink-3">{t(`hero.stats.${stat.key}` as "hero.stats.projects")}</dt>
                  <dd className="mt-2 text-3xl font-semibold text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <CtaBand title={t("about.cta.title")} subtitle={t("about.cta.subtitle")}>
        <Link href={`${basePath}/contact`} className={buttonClasses("primary", "lg")}>
          {t("about.cta.button")}
        </Link>
      </CtaBand>
    </>
  );
}
