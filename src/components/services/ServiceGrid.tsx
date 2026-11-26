"use client";

import Link from "next/link";
import { Globe, Smartphone, Puzzle, Layout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/components/providers/PublicSettingsProvider";
import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/settings";

const serviceIcons = {
  WEB_DEVELOPMENT: Globe,
  MOBILE_APPS: Smartphone,
  WORDPRESS_PLUGINS: Puzzle,
  WORDPRESS_TEMPLATES: Layout,
};

export const categoryKeys: Record<string, string> = {
  WEB_DEVELOPMENT: "webDev",
  MOBILE_APPS: "mobileApps",
  WORDPRESS_PLUGINS: "wpPlugins",
  WORDPRESS_TEMPLATES: "wpTemplates",
};

export interface ServiceGridItem {
  type: string;
  slug: string;
  price: number | null;
  priceLabel: string | null;
  features: string[];
}

/** The four service categories as a ruled two-column grid with price and link. */
export function ServiceGrid({
  locale,
  services,
  linkLabelKey = "services.request",
  className,
}: {
  locale: Locale;
  services: ServiceGridItem[];
  linkLabelKey?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const basePath = `/${locale}`;

  return (
    <ul className={cn("grid border-t border-line md:grid-cols-2", className)}>
      {services.map((service, index) => {
        const Icon = serviceIcons[service.type as keyof typeof serviceIcons] || Globe;
        const key = categoryKeys[service.type] || "webDev";
        const title = t(`services.${key}.title`);
        const benefits =
          service.features.length > 0
            ? service.features.slice(0, 3)
            : [t(`services.${key}.b1`), t(`services.${key}.b2`), t(`services.${key}.b3`)];
        // The stored label already reads "From 1000 MAD"; only build one when it is missing.
        const price =
          service.priceLabel ||
          (service.price != null
            ? `${t("services.from")} ${formatPrice(service.price, locale)}`
            : t("home.services.custom"));
        const linkLabel = t(linkLabelKey);

        return (
          <li
            key={service.type}
            className={cn(
              "flex flex-col border-b border-line py-10 lg:py-12",
              index % 2 === 0 ? "md:pe-10 lg:pe-14" : "md:border-s md:ps-10 lg:ps-14"
            )}
          >
            <Icon aria-hidden className="h-6 w-6 text-action" strokeWidth={1.75} />
            <h3 className="mt-6 text-subheading text-ink">{title}</h3>
            <p className="mt-3 max-w-md text-ink-2">{t(`services.${key}.desc`)}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="rounded-md border border-line px-2.5 py-1 text-sm text-ink-2">
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-10">
              <p className="text-lg font-medium text-ink">{price}</p>
              <Link
                href={`${basePath}/services/${service.slug}`}
                className="text-sm font-medium text-action underline decoration-action/40 underline-offset-4 transition-colors hover:decoration-action"
                aria-label={`${linkLabel}: ${title}`}
              >
                {linkLabel}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
