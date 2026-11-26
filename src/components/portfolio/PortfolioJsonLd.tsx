import {
  getSiteUrl,
  localeToInLanguage,
  publisherLogoUrl,
  SITE_NAME,
} from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/json-ld";

type PortfolioJsonLdProps = {
  locale: string;
  title: string;
  description: string;
  url: string;
  image?: string | null;
  technologies: string[];
  client?: string | null;
};

export function PortfolioJsonLd({
  locale,
  title,
  description,
  url,
  image,
  technologies,
  client,
}: PortfolioJsonLdProps) {
  const siteUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url,
    image: image ? [image] : undefined,
    inLanguage: localeToInLanguage(locale as "fr" | "en" | "ar"),
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: publisherLogoUrl(),
    },
    ...(client
      ? {
          about: {
            "@type": "Organization",
            name: client,
          },
        }
      : {}),
    keywords: technologies.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
