"use client";

import Link from "next/link";
import {
  Globe,
  Smartphone,
  Puzzle,
  Layout,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useCurrency } from "@/components/providers/PublicSettingsProvider";
import { type Locale } from "@/lib/i18n/settings";
import { HOME_SERVICE_TYPES, SERVICE_CATEGORY_SLUGS } from "@/lib/services";
import type { PortfolioCategory } from "@/lib/portfolio-category";

const serviceIcons = {
  WEB_DEVELOPMENT: Globe,
  MOBILE_APPS: Smartphone,
  WORDPRESS_PLUGINS: Puzzle,
  WORDPRESS_TEMPLATES: Layout,
};

const categoryKeys: Record<string, string> = {
  WEB_DEVELOPMENT: "webDev",
  MOBILE_APPS: "mobileApps",
  WORDPRESS_PLUGINS: "wpPlugins",
  WORDPRESS_TEMPLATES: "wpTemplates",
};

type ServiceCategory = {
  type: string;
  slug: string;
  price: number | null;
  priceLabel: string | null;
  features: string[];
};

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
  categories: ServiceCategory[];
  projects: PortfolioPreview[];
  whatsappUrl: string;
}) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const basePath = `/${locale}`;

  const processSteps = t("servicesLanding.process.steps", {
    returnObjects: true,
  }) as { title: string; desc: string }[];

  const whyItems = t("servicesLanding.why.items", {
    returnObjects: true,
  }) as { title: string; desc: string }[];

  const faqItems = t("servicesLanding.faq.items", {
    returnObjects: true,
  }) as { q: string; a: string }[];

  return (
    <>
      {/* Hero */}
      <section className="premium-grid relative pt-10 pb-16 md:pt-14 md:pb-20">
        <div className="hero-ambient pointer-events-none" aria-hidden>
          <div className="hero-ambient-glow -left-32 top-0 h-80 w-80 bg-brand-green/20" />
          <div className="hero-ambient-glow -right-32 bottom-0 h-72 w-72 bg-brand-purple/15" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
              {t("servicesLanding.hero.badge")}
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("servicesLanding.hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              {t("servicesLanding.hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`${basePath}/contact`}>
                <Button size="lg">
                  {t("servicesLanding.hero.cta")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">
                  {t("cta.whatsapp")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("servicesLanding.grid.title")}
            subtitle={t("servicesLanding.grid.subtitle")}
          />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {categories.map((service) => {
              const Icon =
                serviceIcons[service.type as keyof typeof serviceIcons] || Globe;
              const key = categoryKeys[service.type] || "webDev";

              return (
                <GlassCard key={service.type} className="flex h-full flex-col">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 text-brand-green">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {t(`services.${key}.title`)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">
                        {t(`services.${key}.desc`)}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-2">
                    {(service.features.length > 0
                      ? service.features.slice(0, 3)
                      : [
                          t(`services.${key}.b1`),
                          t(`services.${key}.b2`),
                          t(`services.${key}.b3`),
                        ]
                    ).map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2 text-sm text-white/65"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/40">
                        {t("services.from")}
                      </p>
                      <p className="text-2xl font-bold text-brand-green">
                        {service.priceLabel ||
                          (service.price != null
                            ? formatPrice(service.price, locale)
                            : t("home.services.custom"))}
                      </p>
                    </div>
                    <Link href={`${basePath}/services/${service.slug}`}>
                      <Button size="sm">
                        {t("services.learnMore")}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("servicesLanding.why.title")}
            subtitle={t("servicesLanding.why.subtitle")}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.isArray(whyItems) &&
              whyItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-brand-card/50 p-6"
                >
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{item.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("servicesLanding.process.title")}
            subtitle={t("servicesLanding.process.subtitle")}
          />
          <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.isArray(processSteps) &&
              processSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                >
                  <span className="text-3xl font-bold text-brand-green/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{step.desc}</p>
                </li>
              ))}
          </ol>
        </div>
      </section>

      {/* Pricing overview */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("servicesLanding.pricing.title")}
            subtitle={t("servicesLanding.pricing.subtitle")}
          />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_SERVICE_TYPES.map((type) => {
              const cat = categories.find((c) => c.type === type);
              const key = categoryKeys[type];
              return (
                <div
                  key={type}
                  className="rounded-2xl border border-white/10 bg-brand-card/40 p-6 text-center"
                >
                  <h3 className="font-semibold text-white">{t(`services.${key}.title`)}</h3>
                  <p className="mt-4 text-2xl font-bold text-brand-green">
                    {cat?.priceLabel ||
                      (cat?.price != null
                        ? formatPrice(cat.price, locale)
                        : t("home.services.custom"))}
                  </p>
                  <Link
                    href={`${basePath}/services/${SERVICE_CATEGORY_SLUGS[type]}`}
                    className="mt-4 inline-flex text-sm text-brand-green hover:underline"
                  >
                    {t("services.learnMore")} →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/[0.06] py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t("servicesLanding.faq.title")} />
          <div className="mt-10 space-y-4">
            {Array.isArray(faqItems) &&
              faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
                    {item.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-white/40 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{item.a}</p>
                </details>
              ))}
          </div>
        </div>
      </section>

      {/* Portfolio preview */}
      {projects.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t("servicesLanding.portfolio.title")}
              subtitle={t("servicesLanding.portfolio.subtitle")}
            />
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`${basePath}/portfolio/${project.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-brand-green/30"
                >
                  <div className="relative aspect-[16/10] bg-brand-card">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white group-hover:text-brand-green">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/50">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href={`${basePath}/portfolio`} className="text-sm text-brand-green hover:underline">
                {t("home.portfolio.viewAll")} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials placeholder */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            title={t("servicesLanding.testimonials.title")}
            subtitle={t("servicesLanding.testimonials.subtitle")}
          />
          <p className="mx-auto mt-8 max-w-xl rounded-2xl border border-dashed border-white/15 px-6 py-10 text-sm text-white/40">
            {t("servicesLanding.testimonials.placeholder")}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand-green/20 bg-gradient-to-br from-brand-green/10 to-brand-purple/10 p-10 text-center sm:p-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("servicesLanding.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/65">
              {t("servicesLanding.cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={`${basePath}/contact`}>
                <Button size="lg">{t("servicesLanding.cta.button")}</Button>
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">
                  {t("cta.whatsapp")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
