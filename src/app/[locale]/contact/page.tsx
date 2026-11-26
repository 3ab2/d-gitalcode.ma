import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ContactLeadFormPanel } from "@/components/contact/ContactLeadFormPanel";
import { ContactTrustSignals } from "@/components/contact/ContactTrustSignals";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SocialConnect } from "@/components/social/SocialConnect";
import { getSocialLinks } from "@/lib/social-links";
import { getSiteSettings } from "@/lib/settings";
import { getAllServices } from "@/lib/services";
import { toContactServiceOptions } from "@/lib/contact-form-options";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  return buildPublicPageMetadata({
    locale: loc,
    path: "contact",
    title: t("contact.title"),
    description: t("contact.headline"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const [{ t }, socialLinks, settings, services] = await Promise.all([
    getTranslation(loc),
    getSocialLinks(),
    getSiteSettings(),
    getAllServices(loc),
  ]);
  const whatsappUrl = buildWhatsAppUrl(
    buildGeneralContactMessage(loc),
    settings.whatsappNumber
  );
  const serviceOptions = toContactServiceOptions(services);

  return (
    <section className="pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          title={t("contact.title")}
          subtitle={t("contact.headline")}
        />

        <div className="mt-10">
          <ContactTrustSignals />
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <ContactLeadFormPanel
              locale={loc}
              sourcePage={`/${loc}/contact`}
              serviceOptions={serviceOptions}
            />
          </Card>

          <Card className="flex flex-col justify-center items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {t("contact.whatsappTitle")}
            </h2>
            <p className="mt-2 text-white/50">{t("contact.whatsappDesc")}</p>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="mt-4 block text-sm text-brand-green hover:underline"
            >
              {settings.contactEmail}
            </a>
            {settings.phone && (
              <p className="mt-2 text-sm text-white/50">{settings.phone}</p>
            )}
            {settings.address && (
              <p className="mt-1 text-sm text-white/50">{settings.address}</p>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              <Button as="span" variant="whatsapp" size="lg">
                {t("contact.whatsappBtn")}
              </Button>
            </a>
          </Card>
        </div>

        <SocialConnect links={socialLinks} />
      </div>
    </section>
  );
}
