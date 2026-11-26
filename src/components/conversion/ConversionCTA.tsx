import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { FacetFrame } from "@/components/ui/FacetFrame";
import { type Locale } from "@/lib/i18n/settings";

type ConversionCTAProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  primaryLabel: string;
  whatsappLabel: string;
  contactLabel: string;
  whatsappUrl: string;
  contactHref: string;
  primaryHref?: string;
  primaryMessage?: string;
};

/** Closing panel: the main action, WhatsApp, and the contact page only when it is a different link. */
export function ConversionCTA({
  locale,
  title,
  subtitle,
  primaryLabel,
  whatsappLabel,
  contactLabel,
  whatsappUrl,
  contactHref,
  primaryHref,
}: ConversionCTAProps) {
  const basePath = `/${locale}`;
  const resolve = (href: string) => (href.startsWith("/") ? href : `${basePath}/${href}`);
  const contactLink = resolve(contactHref);
  const primaryLink = primaryHref ? resolve(primaryHref) : contactLink;

  return (
    <FacetFrame size="lg">
      <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-end lg:p-14">
        <div className="lg:col-span-7">
          <h2 className="max-w-[22ch] text-heading text-ink">{title}</h2>
          <p className="mt-4 max-w-xl text-lead text-ink-2">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
          <Link href={primaryLink} className={buttonClasses("primary", "lg")}>
            {primaryLabel}
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "lg")}>
            {whatsappLabel}
          </a>
          {primaryLink !== contactLink && (
            <Link href={contactLink} className={buttonClasses("ghost", "lg")}>
              {contactLabel}
            </Link>
          )}
        </div>
      </div>
    </FacetFrame>
  );
}
