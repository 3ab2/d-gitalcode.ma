import type { Metadata } from "next";
import {
  defaultLocale,
  locales,
  type Locale,
} from "@/lib/i18n/settings";

export const SITE_NAME = "D-GITALCODE";
/** 1200x630 share image for pages without their own. */
export const DEFAULT_OG_IMAGE = "/og/default.png";
export const DEFAULT_OG_SIZE = { width: 1200, height: 630 };
export const LOGO_IMAGE = "/icons/android-chrome-512x512.png";

/**
 * Used only when NEXT_PUBLIC_SITE_URL is unset. It must resolve: canonical links,
 * the sitemap, and share images are built from it.
 */
export const FALLBACK_SITE_URL = "https://d-gitalcodema.vercel.app";

/** Strip redundant site suffix; root layout template appends `| D-GITALCODE`. */
export function normalizePageTitle(title: string): string {
  return title.replace(/\s*\|\s*D-GITALCODE\s*$/i, "").trim();
}

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

/** Open Graph wants language_TERRITORY, not a BCP 47 tag. */
const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  ar: "ar_MA",
};

export function localeToOgLocale(locale: Locale): string {
  return OG_LOCALE[locale];
}

/** Canonical public site origin (no trailing slash). */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
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
  const pageTitle = normalizePageTitle(title);
  const images = openGraph?.images ?? [{ url: DEFAULT_OG_IMAGE, ...DEFAULT_OG_SIZE, alt: SITE_NAME }];

  return {
    // The layout template appends the brand; skip it when the title already has it.
    title: pageTitle.includes(SITE_NAME) ? { absolute: pageTitle } : pageTitle,
    description,
    alternates,
    robots,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: localeToOgLocale(locale),
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map(localeToOgLocale),
      title: pageTitle,
      description,
      url: canonical,
      ...openGraph,
      images,
    },
    // A page-level twitter object replaces the root one, so the image is repeated here.
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images,
      ...twitter,
    },
  };
}

export function publisherLogoUrl(): string {
  return `${getSiteUrl()}${LOGO_IMAGE}`;
}
