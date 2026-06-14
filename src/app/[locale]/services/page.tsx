import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { getHomepageServiceCategories } from "@/lib/services";
import { getFeaturedProjects, serializePortfolioListItem } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/settings";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { ServicesLanding } from "@/components/services/ServicesLanding";

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
    path: "services",
    title: t("servicesLanding.meta.title"),
    description: t("servicesLanding.meta.description"),
  });
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const [categories, projects, settings] = await Promise.all([
    getHomepageServiceCategories(loc),
    getFeaturedProjects(loc, 3),
    getSiteSettings(),
  ]);

  const whatsappUrl = buildWhatsAppUrl(
    buildGeneralContactMessage(locale),
    settings.whatsappNumber
  );

  return (
    <ServicesLanding
      locale={loc}
      categories={categories}
      projects={projects.map((p) => serializePortfolioListItem(p, loc))}
      whatsappUrl={whatsappUrl}
    />
  );
}
