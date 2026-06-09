import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ClientContactForm } from "@/components/contact/ClientContactForm";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SocialConnect } from "@/components/social/SocialConnect";
import { getSocialLinks } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [{ t }, socialLinks] = await Promise.all([
    getTranslation(locale as Locale),
    getSocialLinks(),
  ]);
  const whatsappUrl = buildWhatsAppUrl(
    buildGeneralContactMessage(locale as Locale)
  );

  return (
    <section className="pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <ClientContactForm locale={locale as Locale} />
          </Card>

          <Card className="flex flex-col justify-center items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              {t("contact.whatsappTitle")}
            </h3>
            <p className="mt-2 text-white/50">{t("contact.whatsappDesc")}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              <Button variant="whatsapp" size="lg">
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
