"use client";

import Link from "next/link";
import { Globe, Smartphone, Puzzle, Layout, ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useCurrency } from "@/components/providers/PublicSettingsProvider";
import { type Locale } from "@/lib/i18n/settings";

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

const fallbackBenefits: Record<string, string[]> = {
  WEB_DEVELOPMENT: ["services.webDev.b1", "services.webDev.b2", "services.webDev.b3"],
  MOBILE_APPS: ["services.mobileApps.b1", "services.mobileApps.b2", "services.mobileApps.b3"],
  WORDPRESS_PLUGINS: ["services.wpPlugins.b1", "services.wpPlugins.b2", "services.wpPlugins.b3"],
  WORDPRESS_TEMPLATES: ["services.wpTemplates.b1", "services.wpTemplates.b2", "services.wpTemplates.b3"],
};

interface ServiceItem {
  type: string;
  slug: string;
  price: number | null;
  priceLabel: string | null;
  features: string[];
}

export function ServicesSection({
  locale,
  services,
}: {
  locale: Locale;
  services: ServiceItem[];
}) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const basePath = `/${locale}`;

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-brand-purple/[0.03] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("home.services.title")} subtitle={t("home.services.subtitle")} />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = serviceIcons[service.type as keyof typeof serviceIcons] || Globe;
            const key = categoryKeys[service.type] || "webDev";
            const benefits =
              service.features.length > 0
                ? service.features.slice(0, 3)
                : (fallbackBenefits[service.type] || []).map((k) => t(k));

            return (
              <GlassCard key={service.type} className="group flex h-full flex-col">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 text-brand-green transition-colors group-hover:bg-brand-green/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {t(`services.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {t(`services.${key}.desc`)}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-2">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-white/65">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60">
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
                    <Button as="span" size="sm">
                      {t("services.request")}
                      <ArrowRight className="rtl:rotate-180 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`${basePath}/services`}
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-green hover:underline"
          >
            {t("services.viewAll")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
