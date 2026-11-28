import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleDashed, ExternalLink, MinusCircle, ShieldCheck } from "lucide-react";
import { getTranslation } from "@/lib/i18n/server";
import { locales, type Locale } from "@/lib/i18n/settings";
import { buildPageAlternates, buildPublicPageMetadata, getSiteUrl } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/settings";
import { buildServiceRequestMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/Badge";
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{children}</div>
    </section>
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

      <article className="pt-10 pb-20 md:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`${basePath}/portfolio`}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-white/50 transition-colors hover:text-brand-green"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("portfolio.detail.back")}
          </Link>

          <header className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="purple" className="mb-4">
                {c.statusLabel}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {c.title}
              </h1>
              <p className="mt-3 text-base font-medium text-brand-green" data-testid="autopin-attribution">
                {c.attribution}
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{c.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {AUTOPIN_TECHNOLOGIES.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={AUTOPIN_PRIVACY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/10 px-5 py-2.5 text-sm font-medium text-brand-green transition hover:bg-brand-green/15"
                >
                  {c.privacyLink}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href={basePath}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
                >
                  {c.agencyLink}
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-brand-card shadow-2xl shadow-black/40">
              <Image
                src={AUTOPIN_COVER}
                alt={c.screens.dashboard}
                width={SHOT_WIDTH}
                height={SHOT_HEIGHT}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </div>
          </header>

          <div className="mt-16 space-y-6">
            <section
              className="rounded-2xl border border-brand-purple/30 bg-brand-purple/[0.06] p-6 sm:p-8"
              aria-labelledby="autopin-status"
            >
              <h2 id="autopin-status" className="flex items-center gap-2 text-lg font-semibold text-white sm:text-xl">
                <ShieldCheck className="h-5 w-5 shrink-0 text-[#b3a6fa]" />
                {c.statusLabel}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">{c.statusText}</p>
            </section>

            <Section title={c.introTitle}>
              <p>{c.intro}</p>
            </Section>

            <div className="grid gap-6 lg:grid-cols-2">
              <Section title={c.problemTitle}>
                <p>{c.problem}</p>
              </Section>
              <Section title={c.audienceTitle}>
                <p>{c.audience}</p>
              </Section>
            </div>

            <Section title={c.verifiedTitle}>
              <p className="text-white/50">{c.verifiedNote}</p>
              <ul className="mt-4 space-y-3">
                {c.verified.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <div className="grid gap-6 lg:grid-cols-2">
              <Section title={c.partialTitle}>
                <ul className="space-y-3">
                  {c.partial.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section title={c.notClaimedTitle}>
                <ul className="space-y-3">
                  {c.notClaimed.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <MinusCircle className="mt-0.5 h-5 w-5 shrink-0 text-white/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            <Section title={c.architectureTitle}>
              <dl className="grid gap-4 sm:grid-cols-2">
                {c.architecture.map((row) => (
                  <div key={row.label} className="rounded-xl bg-white/[0.03] p-4">
                    <dt className="text-sm font-semibold text-white">{row.label}</dt>
                    <dd className="mt-1 text-sm text-white/60">{row.text}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          </div>

          <section className="mt-16" aria-labelledby="autopin-screens">
            <h2 id="autopin-screens" className="text-xl font-semibold text-white sm:text-2xl">
              {c.screensTitle}
            </h2>
            <p className="mt-2 text-sm text-white/50">{c.screensNote}</p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {AUTOPIN_SCREENSHOTS.map((shot) => (
                <figure key={shot.key} className="overflow-hidden rounded-xl border border-white/10 bg-brand-card">
                  <Image
                    src={shot.src}
                    alt={c.screens[shot.key]}
                    width={SHOT_WIDTH}
                    height={SHOT_HEIGHT}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-auto w-full"
                  />
                  <figcaption className="px-4 py-3 text-sm text-white/60">{c.screens[shot.key]}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8" aria-labelledby="autopin-trust">
            <h2 id="autopin-trust" className="text-lg font-semibold text-white sm:text-xl">
              {c.trustTitle}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-white/65 sm:text-base">
              <li>
                {c.attribution} ·{" "}
                <Link href={basePath} className="text-brand-green underline-offset-4 hover:underline">
                  {c.agencyLink}
                </Link>
              </li>
              <li>
                <a
                  href={AUTOPIN_PRIVACY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-green underline-offset-4 hover:underline"
                >
                  {c.privacyLink}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li className="text-white/50">{c.disclaimer}</li>
            </ul>
          </section>

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
