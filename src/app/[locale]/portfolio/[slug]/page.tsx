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
import { Badge } from "@/components/ui/Badge";
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

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{children}</div>
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

      <article className="pt-10 pb-20 md:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`${basePath}/portfolio`}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-white/50 transition-colors hover:text-brand-green"
          >
            <ArrowLeft className="rtl:rotate-180 h-4 w-4" />
            {t("portfolio.detail.back")}
          </Link>

          <header className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4">
                {t(`home.portfolio.filters.${category}`)}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {translation.title}
              </h1>
              {translation.client && (
                <p className="mt-3 text-sm text-white/60">
                  {t("portfolio.detail.client")}: {translation.client}
                </p>
              )}
              {project.technologies.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/10 px-5 py-2.5 text-sm font-medium text-brand-green transition hover:bg-brand-green/15"
                  >
                    {t("portfolio.viewProject")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {repositoryUrl && (
                  <a
                    href={repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
                  >
                    GitHub
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {coverImage && (
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-brand-card shadow-2xl shadow-black/40">
                <Image
                  src={coverImage}
                  alt={translation.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
          </header>

          <div className="mt-16 space-y-6">
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
                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {project.technologies.length > 0 && (
              <DetailSection title={t("portfolio.detail.stack")}>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
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

          {gallery.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                {t("portfolio.detail.gallery")}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-brand-card"
                  >
                    <Image
                      src={src}
                      alt={`${translation.title} — ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16">
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
        </div>
      </article>
    </>
  );
}
