"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { FacetFrame } from "@/components/ui/FacetFrame";
import { trackBlogCtaClick } from "@/lib/analytics/blog-cta";

export type BlogCTALabels = {
  badge: string;
  title: string;
  subtitle: string;
  quote: string;
};

export function BlogCTA({
  locale,
  slug,
  basePath,
  labels,
}: {
  locale: string;
  slug: string;
  basePath: string;
  labels: BlogCTALabels;
}) {
  const quoteHref = `${basePath}/contact?from=blog&article=${encodeURIComponent(slug)}`;

  return (
    <section aria-labelledby="blog-cta-heading" className="mt-16">
      <FacetFrame size="md">
        <div className="p-8 md:p-10">
          <p className="text-sm text-accent-ink">{labels.badge}</p>
          <h2 id="blog-cta-heading" className="mt-3 max-w-[24ch] text-subheading text-ink md:text-[1.75rem] md:leading-tight">
            {labels.title}
          </h2>
          <p className="mt-3 max-w-2xl text-ink-2">{labels.subtitle}</p>
          <Link
            href={quoteHref}
            onClick={() => trackBlogCtaClick("quote", slug, locale)}
            className={buttonClasses("primary", "lg", "mt-8")}
          >
            {labels.quote}
          </Link>
        </div>
      </FacetFrame>
    </section>
  );
}
