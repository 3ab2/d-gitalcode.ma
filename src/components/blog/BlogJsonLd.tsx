import {
  getSiteUrl,
  localeToInLanguage,
  publisherLogoUrl,
  SITE_NAME,
  localizedUrl,
} from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import type { Locale } from "@/lib/i18n/settings";

export function BlogJsonLd({
  locale,
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  blogLabel = "Blog",
}: {
  locale: Locale;
  title: string;
  description?: string | null;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  author: string;
  blogLabel?: string;
}) {
  const siteUrl = getSiteUrl();
  const blogUrl = localizedUrl(locale, "blog");
  const logoUrl = publisherLogoUrl();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}/#article`,
        headline: title,
        description: description ?? undefined,
        image: image ? [image] : undefined,
        datePublished: datePublished ?? undefined,
        dateModified: dateModified ?? datePublished ?? undefined,
        inLanguage: localeToInLanguage(locale),
        author: {
          "@type": "Organization",
          name: author,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: logoUrl,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        isPartOf: {
          "@type": "Blog",
          "@id": `${blogUrl}/#blog`,
          name: blogLabel,
          url: blogUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: localizedUrl(locale),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: blogLabel,
            item: blogUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: url,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
