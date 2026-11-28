import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/social/GitHubIcon";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { PageHero } from "@/components/ui/PageHero";
import { FacetFrame } from "@/components/ui/FacetFrame";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { publicRepositoryUrl } from "@/config/verified-facts";
import { getPublishedProjects } from "@/lib/portfolio";
import { ConversionCTA } from "@/components/conversion/ConversionCTA";
import { getSiteSettings } from "@/lib/settings";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  AUTOPIN_COVER,
  AUTOPIN_SLUG,
  AUTOPIN_TECHNOLOGIES,
  getAutoPinCase,
} from "@/config/autopin-case";

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
  const autopin = getAutoPinCase(loc);
  const autopinHref = `${basePath}/portfolio/${AUTOPIN_SLUG}`;
  const otherProjects = projects.filter((project) => project.slug !== AUTOPIN_SLUG);
  const whatsappUrl = buildWhatsAppUrl(
    buildGeneralContactMessage(locale),
    settings.whatsappNumber
  );

  return (
    <>
      <PageHero title={t("portfolio.title")} lead={t("portfolio.subtitle")} />

      <section className="section-y">
        <div className="container-site">
          <ul className="grid gap-x-10 gap-y-20 md:grid-cols-2">
              <li>
                <article>
                  <Link href={autopinHref} className="group block" tabIndex={-1} aria-hidden>
                    <FacetFrame size="md" className="transition-colors duration-200 group-hover:bg-white/30">
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={AUTOPIN_COVER}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-left-top"
                        />
                      </div>
                    </FacetFrame>
                  </Link>
                  <h2 className="mt-6 text-lg font-medium text-ink">
                    <Link href={autopinHref} className="hover:underline hover:underline-offset-4">
                      {autopin.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-ink-3">{autopin.attribution}</p>
                  <p className="mt-3 line-clamp-3 max-w-xl text-ink-2">{autopin.cardDescription}</p>
                  <p className="mt-4 font-mono text-xs text-ink-3">
                    {AUTOPIN_TECHNOLOGIES.slice(0, 5).join("  /  ")}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    <Link
                      href={autopinHref}
                      className="font-medium text-action underline decoration-action/40 underline-offset-4 hover:decoration-action"
                    >
                      {t("portfolio.detail.viewCase")}
                    </Link>
                  </div>
                </article>
              </li>
              {otherProjects.map((project) => {
                const translation = project.translations[0];
                const title = translation?.title || project.slug;
                const caseHref = `${basePath}/portfolio/${project.slug}`;
                const repositoryUrl = publicRepositoryUrl(project.githubUrl);
                return (
                  <li key={project.id}>
                    <article>
                      <Link href={caseHref} className="group block" tabIndex={-1} aria-hidden>
                        <FacetFrame size="md" className="transition-colors duration-200 group-hover:bg-white/30">
                          <div className="relative aspect-[16/10]">
                            {project.image ? (
                              <Image
                                src={project.image}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-6 text-center text-ink-3">{title}</div>
                            )}
                          </div>
                        </FacetFrame>
                      </Link>
                      <h2 className="mt-6 text-lg font-medium text-ink">
                        <Link href={caseHref} className="hover:underline hover:underline-offset-4">
                          {title}
                        </Link>
                      </h2>
                      {translation?.client && <p className="mt-1 text-sm text-ink-3">{translation.client}</p>}
                      {translation?.description && (
                        <p className="mt-3 line-clamp-3 max-w-xl text-ink-2">{translation.description}</p>
                      )}
                      {project.technologies.length > 0 && (
                        <p className="mt-4 font-mono text-xs text-ink-3">
                          {project.technologies.slice(0, 5).join("  /  ")}
                        </p>
                      )}
                      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                        <Link
                          href={caseHref}
                          className="font-medium text-action underline decoration-action/40 underline-offset-4 hover:decoration-action"
                        >
                          {t("portfolio.detail.viewCase")}
                        </Link>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink"
                          >
                            {t("portfolio.viewProject")}
                            <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {repositoryUrl && (
                          <a
                            href={repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink"
                          >
                            <GitHubIcon className="h-3.5 w-3.5" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
          </ul>
        </div>
      </section>

      <section className="section-y border-t border-line">
        <div className="container-site">
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
      </section>
    </>
  );
}
