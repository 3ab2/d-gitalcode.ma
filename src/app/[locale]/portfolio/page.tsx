import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/social/GitHubIcon";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { getPublishedProjects } from "@/lib/portfolio";
import { ConversionCTA } from "@/components/conversion/ConversionCTA";
import { getSiteSettings } from "@/lib/settings";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

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
    path: "portfolio",
    title: t("portfolio.title"),
    description: t("portfolio.subtitle"),
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  const [projects, settings] = await Promise.all([
    getPublishedProjects(loc),
    getSiteSettings(),
  ]);
  const basePath = `/${locale}`;
  const whatsappUrl = buildWhatsAppUrl(
    buildGeneralContactMessage(locale),
    settings.whatsappNumber
  );

  return (
    <section className="pt-10 pb-20 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("portfolio.title")}
          subtitle={t("portfolio.subtitle")}
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const translation = project.translations[0];
            return (
              <Card key={project.id} className="overflow-hidden p-0 transition hover:border-brand-green/20">
                <Link href={`${basePath}/portfolio/${project.slug}`} className="block">
                  {project.image && (
                    <div className="relative h-48">
                      <Image
                        src={project.image}
                        alt={translation?.title || project.slug}
                        fill
                        className="object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white hover:text-brand-green">
                      {translation?.title || project.slug}
                    </h3>
                    {translation?.client && (
                      <p className="mt-1 text-sm text-white/40">{translation.client}</p>
                    )}
                    <p className="mt-3 line-clamp-3 text-sm text-white/50">
                      {translation?.description}
                    </p>
                    {project.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech}>{tech}</Badge>
                        ))}
                      </div>
                    )}
                    <span className="mt-4 inline-flex text-sm font-medium text-brand-green">
                      {t("portfolio.detail.viewCase")} →
                    </span>
                  </div>
                </Link>
                {(project.url || project.githubUrl) && (
                  <div className="flex flex-wrap items-center gap-4 border-t border-white/5 px-6 pb-6">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-green"
                      >
                        {t("portfolio.viewProject")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
                      >
                        GitHub
                        <GitHubIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {projects.length === 0 && (
          <p className="mt-16 text-center text-white/50">{t("portfolio.subtitle")}</p>
        )}

        <div className="mt-16">
          <ConversionCTA
            locale={loc}
            title={t("portfolio.listCta.title")}
            subtitle={t("portfolio.listCta.subtitle")}
            primaryLabel={t("portfolio.listCta.button")}
            whatsappLabel={t("cta.whatsapp")}
            contactLabel={t("cta.button")}
            whatsappUrl={whatsappUrl}
            contactHref={`${basePath}/contact`}
            primaryHref={`${basePath}/contact`}
          />
        </div>
      </div>
    </section>
  );
}
