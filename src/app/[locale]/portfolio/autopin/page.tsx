import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleDashed, ExternalLink, MinusCircle, ShieldCheck } from "lucide-react";
import { getTranslation } from "@/lib/i18n/server";
import { locales, type Locale } from "@/lib/i18n/settings";
import { buildPageAlternates, buildPublicPageMetadata, getSiteUrl } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/settings";
import { buildServiceRequestMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { FacetFrame } from "@/components/ui/FacetFrame";
import { ConversionCTA } from "@/components/conversion/ConversionCTA";
import { PortfolioJsonLd } from "@/components/portfolio/PortfolioJsonLd";
import {
  AUTOPIN_COVER,
  AUTOPIN_OG_IMAGE,
  AUTOPIN_PRIVACY_URL,
  AUTOPIN_SCREENSHOTS,
  AUTOPIN_SLUG,
  AUTOPIN_TECHNOLOGIES,
  getAutoPinCase,
} from "@/config/autopin-case";

const PATH = `portfolio/${AUTOPIN_SLUG}`;
const SHOT_WIDTH = 1600;
const SHOT_HEIGHT = 790;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const c = getAutoPinCase(loc);
  const title = `${c.title} — ${c.attribution}`;
  return buildPublicPageMetadata({
    locale: loc,
    path: PATH,
    title,
    description: c.metaDescription,
    openGraph: {
      title,
      description: c.metaDescription,
      images: [{ url: AUTOPIN_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
  });
}

function DetailSection({
  title,
  id,
  children,
}: {
  title: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10" aria-labelledby={id}>
      <h2 id={id} className="text-subheading text-ink">
        {title}
      </h2>
      <div className="mt-4 max-w-2xl text-ink-2">{children}</div>
    </section>
  );
}

function ClaimList({ items, icon: Icon, iconClass }: { items: string[]; icon: typeof CheckCircle2; iconClass: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Icon aria-hidden className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function AutoPinCasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  const settings = await getSiteSettings();
  const c = getAutoPinCase(loc);
  const basePath = `/${locale}`;
  const canonical = buildPageAlternates(PATH, loc).canonical;
  const whatsappUrl = buildWhatsAppUrl(
    buildServiceRequestMessage(c.title, locale),
    settings.whatsappNumber
  );

  return (
    <>
      <PortfolioJsonLd
        locale={locale}
        title={`${c.title} — ${c.attribution}`}
        description={c.metaDescription}
        url={canonical}
        image={`${getSiteUrl()}${AUTOPIN_COVER}`}
        technologies={AUTOPIN_TECHNOLOGIES}
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
            <p className="mt-10 text-sm text-accent-ink">{c.statusLabel}</p>
            <h1 className="mt-3 max-w-[20ch] text-title text-ink">{c.title}</h1>
            <p className="mt-4 font-medium text-ink" data-testid="autopin-attribution">
              {c.attribution}
            </p>
            <p className="mt-4 max-w-2xl text-lg text-ink-2">{c.tagline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={AUTOPIN_PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "lg")}
              >
                {c.privacyLink}
                <ExternalLink aria-hidden className="h-4 w-4" />
              </a>
              <Link href={basePath} className={buttonClasses("outline", "lg")}>
                {c.agencyLink}
              </Link>
            </div>
          </div>
        </header>

        <div className="container-site pt-14 lg:pt-20">
          <FacetFrame size="lg">
            <Image
              src={AUTOPIN_COVER}
              alt={c.screens.dashboard}
              width={SHOT_WIDTH}
              height={SHOT_HEIGHT}
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="block h-auto w-full"
            />
          </FacetFrame>
        </div>

        <div className="container-site section-y grid gap-14 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <dl className="space-y-6 lg:sticky lg:top-28">
              <div>
                <dt className="text-sm text-ink-3">{t("portfolio.detail.stack")}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {AUTOPIN_TECHNOLOGIES.map((tech) => (
                    <span key={tech} className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-ink-2">
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="space-y-12 lg:col-span-8">
            <section
              className="facet border border-line bg-surface p-6 [--facet:1.25rem] sm:p-8"
              aria-labelledby="autopin-status"
            >
              <h2 id="autopin-status" className="flex items-center gap-2 text-subheading text-ink">
                <ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-accent-ink" />
                {c.statusLabel}
              </h2>
              <p className="mt-4 max-w-2xl text-ink-2">{c.statusText}</p>
            </section>

            <DetailSection title={c.introTitle}>
              <p>{c.intro}</p>
            </DetailSection>

            <DetailSection title={c.problemTitle}>
              <p>{c.problem}</p>
            </DetailSection>

            <DetailSection title={c.audienceTitle}>
              <p>{c.audience}</p>
            </DetailSection>

            <DetailSection title={c.verifiedTitle}>
              <p className="mb-4 text-sm text-ink-3">{c.verifiedNote}</p>
              <ClaimList items={c.verified} icon={CheckCircle2} iconClass="text-action" />
            </DetailSection>

            <DetailSection title={c.partialTitle}>
              <ClaimList items={c.partial} icon={CircleDashed} iconClass="text-accent-ink" />
            </DetailSection>

            <DetailSection title={c.notClaimedTitle}>
              <ClaimList items={c.notClaimed} icon={MinusCircle} iconClass="text-ink-3" />
            </DetailSection>

            <DetailSection title={c.architectureTitle}>
              <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {c.architecture.map((row) => (
                  <div key={row.label}>
                    <dt className="font-medium text-ink">{row.label}</dt>
                    <dd className="mt-1 text-sm text-ink-2">{row.text}</dd>
                  </div>
                ))}
              </dl>
            </DetailSection>

            <DetailSection title={c.trustTitle} id="autopin-trust">
              <ul className="space-y-2">
                <li>
                  {c.attribution} ·{" "}
                  <Link
                    href={basePath}
                    className="text-action underline decoration-action/40 underline-offset-4 hover:decoration-action"
                  >
                    {c.agencyLink}
                  </Link>
                </li>
                <li>
                  <a
                    href={AUTOPIN_PRIVACY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-action underline decoration-action/40 underline-offset-4 hover:decoration-action"
                  >
                    {c.privacyLink}
                    <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </li>
                <li className="text-sm text-ink-3">{c.disclaimer}</li>
              </ul>
            </DetailSection>
          </div>
        </div>

        <section className="border-t border-line section-y" aria-labelledby="autopin-screens">
          <div className="container-site">
            <h2 id="autopin-screens" className="text-heading text-ink">
              {c.screensTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-ink-3">{c.screensNote}</p>
            <ul className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2">
              {AUTOPIN_SCREENSHOTS.map((shot) => (
                <li key={shot.key}>
                  <figure>
                    <FacetFrame size="sm">
                      <Image
                        src={shot.src}
                        alt={c.screens[shot.key]}
                        width={SHOT_WIDTH}
                        height={SHOT_HEIGHT}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="block h-auto w-full"
                      />
                    </FacetFrame>
                    <figcaption className="mt-3 text-sm text-ink-3">{c.screens[shot.key]}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

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
