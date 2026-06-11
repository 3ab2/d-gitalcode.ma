import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import {
  getServiceTypeFromSlug,
  getServicesByType,
  mapService,
} from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";

const pageMeta: Record<string, Record<Locale, { title: string; desc: string }>> = {
  "web-development": {
    fr: { title: "Développement Web", desc: "Sites web modernes et applications SaaS haute performance" },
    en: { title: "Web Development", desc: "Modern websites and high-performance SaaS applications" },
    ar: { title: "تطوير الويب", desc: "مواقع حديثة وتطبيقات SaaS عالية الأداء" },
  },
  "mobile-apps": {
    fr: { title: "Applications Mobiles", desc: "Apps iOS et Android natives et cross-platform" },
    en: { title: "Mobile Applications", desc: "Native and cross-platform iOS & Android apps" },
    ar: { title: "تطبيقات الجوال", desc: "تطبيقات iOS و Android أصلية ومتعددة المنصات" },
  },
  "wordpress-plugins": {
    fr: { title: "Plugins WordPress", desc: "Extensions WooCommerce professionnelles" },
    en: { title: "WordPress Plugins", desc: "Professional WooCommerce extensions" },
    ar: { title: "إضافات ووردبريس", desc: "إضافات WooCommerce احترافية" },
  },
  "wordpress-templates": {
    fr: { title: "Templates WordPress", desc: "Thèmes premium optimisés pour la conversion" },
    en: { title: "WordPress Templates", desc: "Premium themes optimized for conversion" },
    ar: { title: "قوالب ووردبريس", desc: "قوالب متميزة محسّنة للتحويل" },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const meta = pageMeta[slug]?.[loc];
  return buildPublicPageMetadata({
    locale: loc,
    path: `services/${slug}`,
    title: meta?.title ?? slug,
    description: meta?.desc,
  });
}

export function generateStaticParams() {
  return [
    { slug: "web-development" },
    { slug: "mobile-apps" },
    { slug: "wordpress-plugins" },
    { slug: "wordpress-templates" },
  ];
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const type = getServiceTypeFromSlug(slug);
  if (!type) notFound();

  const { t } = await getTranslation(locale as Locale);
  const rawServices = await getServicesByType(type, locale as Locale);
  const services = rawServices.map((s) => mapService(s));
  const meta = pageMeta[slug]?.[locale as Locale];

  return (
    <section className="pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={meta?.title || slug}
          subtitle={meta?.desc}
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                locale={locale as Locale}
                service={service}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-white/50">
              {t("services.viewAll")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
