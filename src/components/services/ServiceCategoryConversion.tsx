import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { getServicesByType, getServiceTypeFromSlug, mapService } from "@/lib/services";
import {
  getFeaturedProjects,
  serializePortfolioListItem,
} from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/settings";
import { buildServiceRequestMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ConversionCTA } from "@/components/conversion/ConversionCTA";
import { formatPrice } from "@/lib/currency";

const SLUG_I18N_KEYS: Record<string, string> = {
  "web-development": "webDevelopment",
  "mobile-apps": "mobileApps",
  "wordpress-plugins": "wordpressPlugins",
  "wordpress-templates": "wordpressTemplates",
};

function FunnelSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
        {label}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{children}</div>
    </section>
  );
}

export async function ServiceCategoryConversion({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const { t } = await getTranslation(locale);
  const i18nKey = SLUG_I18N_KEYS[slug] || slug;
  const prefix = `servicesPage.${i18nKey}`;
  const basePath = `/${locale}`;

  const type = getServiceTypeFromSlug(slug)!;
  const [rawServices, projects, settings] = await Promise.all([
    getServicesByType(type, locale),
    getFeaturedProjects(locale, 3),
    getSiteSettings(),
  ]);
  const services = rawServices.map((s) => mapService(s));
  const categoryTitle = t(`${prefix}.title`);
  const whatsappUrl = buildWhatsAppUrl(
    buildServiceRequestMessage(categoryTitle, locale),
    settings.whatsappNumber
  );

  const benefits = t(`${prefix}.benefits`, { returnObjects: true }) as string[];
  const deliverables = t(`${prefix}.deliverables`, { returnObjects: true }) as string[];
  const faqItems = t(`${prefix}.faq`, { returnObjects: true }) as { q: string; a: string }[];
  const timeline = t(`${prefix}.timeline`);

  const cheapest = services.reduce<(typeof services)[0] | null>((best, current) => {
    if (current.price == null) return best ?? current;
    if (best?.price == null) return current;
    return current.price < best.price ? current : best;
  }, null);

  return (
    <div className="pt-10 pb-20 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
            {t("servicesPage.hero.badge")}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {categoryTitle}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            {t(`${prefix}.subtitle`)}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={`${basePath}/contact`}>
              <span className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-green px-8 py-3 text-sm font-semibold text-brand-dark shadow-lg shadow-brand-green/20">
                {t("services.request")}
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-xl border border-white/15 px-8 py-3 text-sm font-medium text-white/80 hover:border-brand-green/30"
            >
              {t("cta.whatsapp")}
            </a>
          </div>
        </header>

        {/* Conversion funnel */}
        <div className="mt-16 space-y-6">
          <FunnelSection label={t("servicesPage.labels.problem")} title={t(`${prefix}.problemTitle`)}>
            <p>{t(`${prefix}.problem`)}</p>
          </FunnelSection>

          <FunnelSection label={t("servicesPage.labels.solution")} title={t(`${prefix}.solutionTitle`)}>
            <p>{t(`${prefix}.solution`)}</p>
          </FunnelSection>

          <FunnelSection label={t("servicesPage.labels.benefits")} title={t(`${prefix}.benefitsTitle`)}>
            {Array.isArray(benefits) && (
              <ul className="space-y-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </FunnelSection>

          <FunnelSection
            label={t("servicesPage.labels.deliverables")}
            title={t(`${prefix}.deliverablesTitle`)}
          >
            {Array.isArray(deliverables) && (
              <ul className="space-y-2">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </FunnelSection>

          <FunnelSection label={t("servicesPage.labels.pricing")} title={t(`${prefix}.pricingTitle`)}>
            <p className="text-3xl font-bold text-brand-green">
              {cheapest?.priceLabel ||
                (cheapest?.price != null
                  ? formatPrice(cheapest.price, settings.defaultCurrency, locale)
                  : t("home.services.custom"))}
            </p>
            <p className="mt-3">{t(`${prefix}.pricing`)}</p>
            <p className="mt-4 text-sm text-white/45">
              {t("servicesPage.labels.timeline")}: {timeline}
            </p>
          </FunnelSection>
        </div>

        {/* FAQ */}
        {Array.isArray(faqItems) && faqItems.length > 0 && (
          <section className="mt-16">
            <SectionHeading title={t("servicesPage.labels.faq")} />
            <div className="mt-8 space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
                    {item.q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-white/40 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Proof of work */}
        {projects.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              title={t("servicesPage.proof.title")}
              subtitle={t("servicesPage.proof.subtitle")}
            />
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.map((p) => {
                const item = serializePortfolioListItem(p, locale);
                return (
                  <Link
                    key={item.slug}
                    href={`${basePath}/portfolio/${item.slug}`}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-brand-green/30"
                  >
                    <div className="relative aspect-[16/10] bg-brand-card">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-white group-hover:text-brand-green">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/50">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Service catalog */}
        {services.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              title={t("servicesPage.catalog.title")}
              subtitle={t("servicesPage.catalog.subtitle")}
            />
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} locale={locale} service={service} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-16">
          <ConversionCTA
            locale={locale}
            title={t("servicesPage.cta.title")}
            subtitle={t("servicesPage.cta.subtitle")}
            primaryLabel={t("services.request")}
            whatsappLabel={t("cta.whatsapp")}
            contactLabel={t("cta.button")}
            whatsappUrl={whatsappUrl}
            contactHref={`${basePath}/contact`}
            primaryHref={`${basePath}/contact`}
          />
        </div>
      </div>
    </div>
  );
}
