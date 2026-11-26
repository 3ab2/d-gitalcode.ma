import Link from "next/link";
import Image from "next/image";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { buttonClasses } from "@/components/ui/Button";
import { FacetFrame } from "@/components/ui/FacetFrame";
import type { PortfolioItem } from "@/components/home/PortfolioSection";

interface HeroProps {
  locale: Locale;
  stats: { key: string; value: string; label: string }[];
  /** The first published project, shown as proof next to the promise. */
  featured?: PortfolioItem;
}

const step = (n: number) => ({ "--rise-step": n }) as React.CSSProperties;

export async function Hero({ locale, stats, featured }: HeroProps) {
  const { t } = await getTranslation(locale);
  const basePath = `/${locale}`;
  const trustItems = t("hero.trust", { returnObjects: true }) as unknown;

  return (
    <section className="border-b border-line">
      <div className="container-site grid gap-14 pt-12 pb-16 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-24 lg:pb-28">
        <div className="lg:col-span-7">
          <h1 className="rise max-w-[18ch] text-display text-ink" style={step(0)}>
            {t("hero.headline")}
          </h1>
          <p className="rise mt-7 max-w-[34rem] text-lead text-ink-2" style={step(1)}>
            {t("hero.subtitle")}
          </p>

          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={step(2)}>
            <Link href={`${basePath}/contact`} className={buttonClasses("primary", "lg")}>
              {t("hero.cta")}
            </Link>
            <Link href={`${basePath}/portfolio`} className={buttonClasses("outline", "lg")}>
              {t("hero.ctaSecondary")}
            </Link>
          </div>

          {Array.isArray(trustItems) && (
            <ul className="rise mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-ink-2" style={step(3)}>
              {(trustItems as string[]).map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span aria-hidden className="facet h-2 w-2 bg-action [--facet:3px]" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {stats.length > 0 && (
            <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.key}>
                  <dt className="text-sm text-ink-3">{t(`hero.stats.${stat.key}`)}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {featured && (
          <figure className="rise lg:col-span-5" style={step(2)}>
            <Link href={`${basePath}/portfolio/${featured.slug}`} className="group block">
              <FacetFrame size="lg" className="transition-colors duration-200 group-hover:bg-white/30">
                <div className="relative aspect-[4/3]">
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-3">{featured.title}</div>
                  )}
                </div>
              </FacetFrame>
              <figcaption className="mt-5 flex items-baseline justify-between gap-4">
                <span className="text-base font-medium text-ink group-hover:underline group-hover:underline-offset-4">
                  {featured.title}
                </span>
                {featured.technologies.length > 0 && (
                  <span className="hidden shrink-0 font-mono text-xs text-ink-3 sm:inline">
                    {featured.technologies.slice(0, 2).join(" + ")}
                  </span>
                )}
              </figcaption>
            </Link>
          </figure>
        )}
      </div>
    </section>
  );
}
