"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    <section
      className="relative mt-12 overflow-hidden rounded-2xl border border-brand-green/20 bg-gradient-to-br from-brand-green/10 via-brand-card/80 to-brand-purple/10 p-8 md:p-10"
      aria-labelledby="blog-cta-heading"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-green/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-brand-purple/10 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            D-GITALCODE
          </span>
          <span className="text-xs text-white/60">{labels.badge}</span>
        </div>

        <h2
          id="blog-cta-heading"
          className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl"
        >
          {labels.title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60">
          {labels.subtitle}
        </p>

        <div className="mt-8">
          <Link
            href={quoteHref}
            onClick={() => trackBlogCtaClick("quote", slug, locale)}
            className="inline-flex"
          >
            <Button as="span" size="lg" className="w-full sm:w-auto">
              {labels.quote}
              <ArrowRight className="rtl:rotate-180 h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
