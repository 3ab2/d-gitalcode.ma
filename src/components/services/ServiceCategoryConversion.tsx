import Link from "next/link";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { getServicesByType, getServiceTypeFromSlug, mapService } from "@/lib/services";
import { getFeaturedProjects, serializePortfolioListItem } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/settings";
import { buildServiceRequestMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/ui/FaqList";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ProjectCard } from "@/components/home/PortfolioSection";
import { ConversionCTA } from "@/components/conversion/ConversionCTA";
import { FormattedPrice } from "@/components/currency/FormattedPrice";

const SLUG_I18N_KEYS: Record<string, string> = {
  "web-development": "webDevelopment",
  "mobile-apps": "mobileApps",
  "wordpress-plugins": "wordpressPlugins",
  "wordpress-templates": "wordpressTemplates",
};

/** One row of the service story: a short label, a heading, then the content. */
function StoryRow({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-b border-line py-12 lg:grid-cols-12 lg:gap-10 lg:py-14">
      <p className="text-sm text-ink-3 lg:col-span-3">{label}</p>
      <div className="lg:col-span-8">
        <h2 className="text-subheading text-ink">{title}</h2>
        <div className="mt-4 max-w-2xl text-ink-2">{children}</div>
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-3">
          <span aria-hidden className="facet h-1.5 w-1.5 shrink-0 translate-y-[-2px] bg-action [--facet:2px]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export async function ServiceCategoryConversion({ locale, slug }: { locale: Locale; slug: string }) {
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
  const whatsappUrl = buildWhatsAppUrl(buildServiceRequestMessage(categoryTitle, locale), settings.whatsappNumber);

  const benefits = t(`${prefix}.benefits`, { returnObjects: true }) as unknown;
  const deliverables = t(`${prefix}.deliverables`, { returnObjects: true }) as unknown;
  const faqItems = t(`${prefix}.faq`, { returnObjects: true }) as unknown;
  const timeline = t(`${prefix}.timeline`);

  const cheapest = services.reduce<(typeof services)[0] | null>((best, current) => {
    if (current.price == null) return best ?? current;
    if (best?.price == null) return current;
    return current.price < best.price ? current : best;
  }, null);

  return (
    <>
      <PageHero title={categoryTitle} lead={t(`${prefix}.subtitle`)}>
        <Link href={`${basePath}/contact`} className={buttonClasses("primary", "lg")}>
          {t("services.request")}
        </Link>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "lg")}>
          {t("cta.whatsapp")}
        </a>
      </PageHero>

      <div className="container-site">
        <StoryRow label={t("servicesPage.labels.problem")} title={t(`${prefix}.problemTitle`)}>
          <p>{t(`${prefix}.problem`)}</p>
        </StoryRow>
        <StoryRow label={t("servicesPage.labels.solution")} title={t(`${prefix}.solutionTitle`)}>
          <p>{t(`${prefix}.solution`)}</p>
        </StoryRow>
        {Array.isArray(benefits) && (
          <StoryRow label={t("servicesPage.labels.benefits")} title={t(`${prefix}.benefitsTitle`)}>
            <BulletList items={benefits as string[]} />
          </StoryRow>
        )}
        {Array.isArray(deliverables) && (
          <StoryRow label={t("servicesPage.labels.deliverables")} title={t(`${prefix}.deliverablesTitle`)}>
            <BulletList items={deliverables as string[]} />
          </StoryRow>
        )}
        <StoryRow label={t("servicesPage.labels.pricing")} title={t(`${prefix}.pricingTitle`)}>
          <FormattedPrice
            amount={cheapest?.price}
            priceLabel={cheapest?.priceLabel}
            locale={locale}
            className="text-2xl font-semibold text-ink"
          />
          <p className="mt-3">{t(`${prefix}.pricing`)}</p>
          <p className="mt-4 text-sm text-ink-3">
            {t("servicesPage.labels.timeline")}: {timeline}
          </p>
        </StoryRow>
      </div>

      {Array.isArray(faqItems) && faqItems.length > 0 && (
        <section className="section-y">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <h2 className="text-heading text-ink lg:col-span-4">{t("servicesPage.labels.faq")}</h2>
            <FaqList items={faqItems as { q: string; a: string }[]} className="lg:col-span-8" />
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site">
            <SectionHeading title={t("servicesPage.proof.title")} subtitle={t("servicesPage.proof.subtitle")} />
            <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {projects.map((p) => {
                const item = serializePortfolioListItem(p, locale);
                return (
                  <li key={item.slug}>
                    <ProjectCard project={item} basePath={basePath} />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="section-y border-t border-line">
          <div className="container-site">
            <SectionHeading title={t("servicesPage.catalog.title")} subtitle={t("servicesPage.catalog.subtitle")} />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} locale={locale} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-y border-t border-line">
        <div className="container-site">
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
      </section>
    </>
  );
}
