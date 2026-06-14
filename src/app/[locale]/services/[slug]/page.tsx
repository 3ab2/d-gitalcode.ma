import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { getServiceTypeFromSlug } from "@/lib/services";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { ServiceCategoryConversion } from "@/components/services/ServiceCategoryConversion";

const SLUG_I18N_KEYS: Record<string, string> = {
  "web-development": "webDevelopment",
  "mobile-apps": "mobileApps",
  "wordpress-plugins": "wordpressPlugins",
  "wordpress-templates": "wordpressTemplates",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  const key = SLUG_I18N_KEYS[slug];
  if (!key) {
    return buildPublicPageMetadata({ locale: loc, path: `services/${slug}`, title: slug });
  }
  return buildPublicPageMetadata({
    locale: loc,
    path: `services/${slug}`,
    title: t(`servicesPage.${key}.title`),
    description: t(`servicesPage.${key}.subtitle`),
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

  return <ServiceCategoryConversion locale={locale as Locale} slug={slug} />;
}
