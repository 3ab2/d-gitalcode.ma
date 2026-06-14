import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
  const contactLink = contactHref.startsWith("/") ? contactHref : `${basePath}/${contactHref}`;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-green/20 bg-gradient-to-br from-brand-green/10 via-brand-card to-brand-purple/10 p-8 sm:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-white/65">{subtitle}</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {primaryHref ? (
            <Link href={primaryHref.startsWith("/") ? primaryHref : `${basePath}/${primaryHref}`}>
              <Button size="lg" className="w-full min-w-[200px] sm:w-auto">
                {primaryLabel}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href={contactLink}>
              <Button size="lg" className="w-full min-w-[200px] sm:w-auto">
                {primaryLabel}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button variant="whatsapp" size="lg" className="w-full min-w-[200px] sm:w-auto">
              <MessageCircle className="h-5 w-5" />
              {whatsappLabel}
            </Button>
          </a>
          <Link href={contactLink}>
            <Button variant="outline" size="lg" className="w-full min-w-[200px] sm:w-auto">
              {contactLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
