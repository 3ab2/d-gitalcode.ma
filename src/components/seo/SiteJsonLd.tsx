import {
  getSiteUrl,
  publisherLogoUrl,
  SITE_NAME,
  localizedUrl,
} from "@/lib/seo/metadata";
import type { Locale } from "@/lib/i18n/settings";

export function SiteJsonLd({ locale }: { locale: Locale }) {
  const siteUrl = getSiteUrl();
  const homeUrl = localizedUrl(locale);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: publisherLogoUrl(),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: SITE_NAME,
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: [locale],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${localizedUrl(locale, "blog")}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${homeUrl}/#webpage`,
        url: homeUrl,
        name: SITE_NAME,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
