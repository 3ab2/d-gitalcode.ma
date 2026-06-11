import type { Metadata } from "next";
import {
  defaultLocale,
  locales,
  type Locale,
} from "@/lib/i18n/settings";

export const SITE_NAME = "D-GITALCODE";
export const DEFAULT_OG_IMAGE = "/icons/android-chrome-512x512.png";

const HREFLANG: Record<Locale, string> = {
  fr: "fr",
  en: "en",
  ar: "ar",
};

const IN_LANGUAGE: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  ar: "ar",
};

/** Canonical public site origin (no trailing slash). */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://d-gitalcode.ma"
  ).replace(/\/$/, "");
}

/** Absolute URL for a locale-prefixed public path (path="" → homepage). */
export function localizedUrl(locale: Locale, path = ""): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${base}/${locale}${normalized}`;
}

/** hreflang + canonical alternates for a localized page cluster. */
export function buildPageAlternates(path: string, locale: Locale) {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[HREFLANG[loc]] = localizedUrl(loc, path);
  }
  languages["x-default"] = localizedUrl(defaultLocale, path);

  return {
    canonical: localizedUrl(locale, path),
    languages,
  };
}

/** Sitemap `alternates.languages` object for the same path cluster. */
export function buildSitemapLanguages(path: string): Record<string, string> {
  return buildPageAlternates(path, defaultLocale).languages;
}

export function localeToInLanguage(locale: Locale): string {
  return IN_LANGUAGE[locale];
}

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: true,
};

type PageMetadataInput = {
  locale: Locale;
  /** Path after locale, e.g. `blog` or `blog/my-slug` (no leading slash required). */
  path?: string;
  title: string;
  description?: string;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
  robots?: Metadata["robots"];
};

/** Standard public-page metadata with canonical + hreflang. */
export function buildPublicPageMetadata({
  locale,
  path = "",
  title,
  description,
  openGraph,
  twitter,
  robots,
}: PageMetadataInput): Metadata {
  const alternates = buildPageAlternates(path, locale);
  const canonical = alternates.canonical;

  return {
    title,
    description,
    alternates,
    robots,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: localeToInLanguage(locale),
      title,
      description,
      url: canonical,
      ...openGraph,
      images: openGraph?.images ?? [
        {
          url: DEFAULT_OG_IMAGE,
          width: 512,
          height: 512,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...twitter,
    },
  };
}

export function publisherLogoUrl(): string {
  return `${getSiteUrl()}${DEFAULT_OG_IMAGE}`;
}
