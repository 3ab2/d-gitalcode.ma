"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { ProcessSteps, type ProcessStep } from "@/components/ui/ProcessSteps";
import { FaqList } from "@/components/ui/FaqList";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceGrid, type ServiceGridItem } from "@/components/services/ServiceGrid";
import { ProjectCard } from "@/components/home/PortfolioSection";
import { type Locale } from "@/lib/i18n/settings";
import type { PortfolioCategory } from "@/lib/portfolio-category";

type PortfolioPreview = {
  slug: string;
  title: string;
  description: string;
  image: string | null;
  category: Exclude<PortfolioCategory, "all">;
};

export function ServicesLanding({
  locale,
  categories,
  projects,
  whatsappUrl,
}: {
  locale: Locale;
  categories: ServiceGridItem[];
  projects: PortfolioPreview[];
  whatsappUrl: string;
}) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;

  const processSteps = t("servicesLanding.process.steps", { returnObjects: true }) as unknown;
  const whyItems = t("servicesLanding.why.items", { returnObjects: true }) as unknown;
  const faqItems = t("servicesLanding.faq.items", { returnObjects: true }) as unknown;

  return (
    <>
      <PageHero title={t("servicesLanding.hero.title")} lead={t("servicesLanding.hero.subtitle")}>
        <Link href={`${basePath}/contact`} className={buttonClasses("primary", "lg")}>
          {t("servicesLanding.hero.cta")}
        </Link>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "lg")}>
          {t("cta.whatsapp")}
        </a>
      </PageHero>

      <section className="section-y">
        <div className="container-site">
          <SectionHeading title={t("servicesLanding.grid.title")} subtitle={t("servicesLanding.grid.subtitle")} />
          <ServiceGrid locale={locale} services={categories} linkLabelKey="services.learnMore" className="mt-14 lg:mt-20" />
        </div>
      </section>

      {Array.isArray(whyItems) && whyItems.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site">
            <SectionHeading title={t("servicesLanding.why.title")} subtitle={t("servicesLanding.why.subtitle")} />
            <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {(whyItems as { title: string; desc: string }[]).map((item) => (
                <div key={item.title} className="border-t border-line pt-6">
                  <dt className="font-medium text-ink">{item.title}</dt>
                  <dd className="mt-3 text-ink-2">{item.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {Array.isArray(processSteps) && processSteps.length > 0 && (
        <section id="method" className="section-y border-t border-line bg-surface/40">
          <div className="container-site">
            <SectionHeading title={t("servicesLanding.process.title")} subtitle={t("servicesLanding.process.subtitle")} />
            <ProcessSteps steps={processSteps as ProcessStep[]} className="mt-14 lg:mt-20" />
          </div>
        </section>
      )}

      {Array.isArray(faqItems) && faqItems.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <h2 className="text-heading text-ink lg:col-span-4">{t("servicesLanding.faq.title")}</h2>
            <FaqList items={faqItems as { q: string; a: string }[]} className="lg:col-span-8" />
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site">
            <SectionHeading title={t("servicesLanding.portfolio.title")} subtitle={t("servicesLanding.portfolio.subtitle")} />
            <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3 lg:mt-20">
              {projects.map((project) => (
                <li key={project.slug}>
                  <ProjectCard project={project} basePath={basePath} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={t("servicesLanding.cta.title")} subtitle={t("servicesLanding.cta.subtitle")}>
        <Link href={`${basePath}/contact`} className={buttonClasses("primary", "lg")}>
          {t("servicesLanding.cta.button")}
        </Link>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "lg")}>
          {t("cta.whatsapp")}
        </a>
      </CtaBand>
    </>
  );
}
