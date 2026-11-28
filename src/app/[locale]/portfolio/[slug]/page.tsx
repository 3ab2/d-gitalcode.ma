import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/social/GitHubIcon";
import { getTranslation } from "@/lib/i18n/server";
import { locales, type Locale } from "@/lib/i18n/settings";
import { buildPageAlternates, buildPublicPageMetadata } from "@/lib/seo/metadata";
import {
  getProjectCategory,
  getProjectTranslation,
  getPublishedProjectBySlug,
  getPublishedProjectSlugs,
} from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/settings";
import { buildServiceRequestMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { FacetFrame } from "@/components/ui/FacetFrame";
import { ConversionCTA } from "@/components/conversion/ConversionCTA";
import { PortfolioJsonLd } from "@/components/portfolio/PortfolioJsonLd";
import { ReleaseFacts } from "@/components/portfolio/ReleaseFacts";
import { getProjectRelease } from "@/config/releases";
import { publicRepositoryUrl } from "@/config/verified-facts";

export async function generateStaticParams() {
  // Pages are also rendered on demand, so a build without a database still succeeds.
  const projects = await getPublishedProjectSlugs().catch(() => []);
  return locales.flatMap((locale) =>
    projects
      .filter((p) => p.translations.some((t) => t.locale === locale))
      .map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const project = await getPublishedProjectBySlug(slug, loc);
  const translation = project ? getProjectTranslation(project, loc) : null;

  if (!project || !translation) {
    return buildPublicPageMetadata({
      locale: loc,
      path: `portfolio/${slug}`,
      title: slug,
    });
  }

  const overview = translation.overview || translation.description;

  return buildPublicPageMetadata({
    locale: loc,
    path: `portfolio/${slug}`,
    title: translation.title,
    description: overview.slice(0, 160),
    openGraph: {
      title: translation.title,
      description: overview.slice(0, 160),
      images: project.image
        ? [{ url: project.image, alt: translation.title }]
        : undefined,
    },
  });
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-10">
      <h2 className="text-subheading text-ink">{title}</h2>
      <div className="mt-4 max-w-2xl text-ink-2">{children}</div>
    </section>
  );
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  const [project, settings] = await Promise.all([
    getPublishedProjectBySlug(slug, loc),
    getSiteSettings(),
  ]);

  if (!project) notFound();

  const translation = getProjectTranslation(project, loc);
  if (!translation) notFound();

  const release = getProjectRelease(slug);
  const repositoryUrl = publicRepositoryUrl(project.githubUrl);
  const basePath = `/${locale}`;
  const category = getProjectCategory(project.technologies);
  const overview = translation.overview || translation.description;
  const features =
    translation.features.length > 0 ? translation.features : [];
  const gallery = project.gallery.filter(Boolean);
  const coverImage = project.image || gallery[0] || null;
  const canonical = buildPageAlternates(`portfolio/${slug}`, loc).canonical;
  const whatsappUrl = buildWhatsAppUrl(
    buildServiceRequestMessage(translation.title, locale),
    settings.whatsappNumber
  );

  return (
    <>
      <PortfolioJsonLd
        locale={locale}
        title={translation.title}
        description={overview}
        url={canonical}
        image={coverImage}
        technologies={project.technologies}
        client={translation.client}
      />

      <article>
        <header className="border-b border-line">
          <div className="container-site pt-10 pb-14 lg:pt-14 lg:pb-20">
            <Link
              href={`${basePath}/portfolio`}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-3 transition-colors hover:text-ink"
            >
              <ArrowLeft aria-hidden className="h-4 w-4 rtl:rotate-180" />
              {t("portfolio.detail.back")}
            </Link>
            <p className="mt-10 text-sm text-accent-ink">{t(`home.portfolio.filters.${category}`)}</p>
            <h1 className="mt-3 max-w-[20ch] text-title text-ink">{translation.title}</h1>
            {translation.client && (
              <p className="mt-4 text-ink-2">
                {t("portfolio.detail.client")}: {translation.client}
              </p>
            )}
            {(project.url || repositoryUrl) && (
              <div className="mt-9 flex flex-wrap gap-3">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className={buttonClasses("primary", "lg")}>
                    {t("portfolio.viewProject")}
                    <ExternalLink aria-hidden className="h-4 w-4" />
                  </a>
                )}
                {repositoryUrl && (
                  <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "lg")}>
                    <GitHubIcon className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {coverImage && (
          <div className="container-site pt-14 lg:pt-20">
            <FacetFrame size="lg">
              <div className="relative aspect-[16/9]">
                <Image
                  src={coverImage}
                  alt={translation.title}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover object-top"
                />
              </div>
            </FacetFrame>
          </div>
        )}

        <div className="container-site section-y grid gap-14 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <dl className="space-y-6 lg:sticky lg:top-28">
              {project.technologies.length > 0 && (
                <div>
                  <dt className="text-sm text-ink-3">{t("portfolio.detail.stack")}</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-ink-2">
                        {tech}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {translation.client && (
                <div>
                  <dt className="text-sm text-ink-3">{t("portfolio.detail.client")}</dt>
                  <dd className="mt-1.5 text-ink">{translation.client}</dd>
                </div>
              )}
            </dl>
          </aside>

          <div className="space-y-12 lg:col-span-8">
            {release && <ReleaseFacts release={release} locale={loc} t={t} />}

            <DetailSection title={t("portfolio.detail.overview")}>
              <p>{overview}</p>
            </DetailSection>

            {translation.challenge && (
              <DetailSection title={t("portfolio.detail.challenge")}>
                <p>{translation.challenge}</p>
              </DetailSection>
            )}

            {translation.solution && (
              <DetailSection title={t("portfolio.detail.solution")}>
                <p>{translation.solution}</p>
              </DetailSection>
            )}

            {features.length > 0 && (
              <DetailSection title={t("portfolio.detail.features")}>
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-baseline gap-3">
                      <span aria-hidden className="facet h-1.5 w-1.5 shrink-0 translate-y-[-2px] bg-action [--facet:2px]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {translation.results && (
              <DetailSection title={t("portfolio.detail.results")}>
                <p>{translation.results}</p>
              </DetailSection>
            )}

            {translation.outcome && (
              <DetailSection title={t("portfolio.detail.outcome")}>
                <p>{translation.outcome}</p>
              </DetailSection>
            )}
          </div>
        </div>

        {gallery.length > 0 && (
          <section className="border-t border-line section-y">
            <div className="container-site">
              <h2 className="text-heading text-ink">{t("portfolio.detail.gallery")}</h2>
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((src, index) => (
                  <li key={`${src}-${index}`}>
                    <FacetFrame size="sm">
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={src}
                          alt={`${translation.title}, ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    </FacetFrame>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="section-y border-t border-line">
          <div className="container-site">
            <ConversionCTA
              locale={loc}
              title={t("portfolio.detail.ctaTitle")}
              subtitle={t("portfolio.detail.ctaSubtitle")}
              primaryLabel={t("portfolio.detail.ctaPrimary")}
              whatsappLabel={t("cta.whatsapp")}
              contactLabel={t("cta.button")}
              whatsappUrl={whatsappUrl}
              contactHref={`${basePath}/contact`}
              primaryHref={`${basePath}/contact`}
            />
          </div>
        </section>
      </article>
    </>
  );
}
