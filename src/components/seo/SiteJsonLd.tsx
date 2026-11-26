import {
  getSiteUrl,
  publisherLogoUrl,
  SITE_NAME,
  localizedUrl,
} from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { DEFAULT_SOCIAL_LINKS } from "@/config/social-links";
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
        sameAs: DEFAULT_SOCIAL_LINKS.filter((l) => l.enabled !== false).map(
          (l) => l.url
        ),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: SITE_NAME,
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: [locale],
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
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
