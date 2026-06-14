"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContactLeadFormPanel } from "@/components/contact/ContactLeadFormPanel";
import { ContactTrustSignals } from "@/components/contact/ContactTrustSignals";
import { SocialLinks } from "@/components/social/SocialLinks";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { usePublicSettings } from "@/components/providers/PublicSettingsProvider";
import { type ContactServiceOption } from "@/lib/contact-form-options";
import { type SocialLinkConfig } from "@/config/social-links";
import { type Locale } from "@/lib/i18n/settings";

export function HomeContactSection({
  locale,
  socialLinks,
  serviceOptions,
}: {
  locale: Locale;
  socialLinks: SocialLinkConfig[];
  serviceOptions: ContactServiceOption[];
}) {
  const { t } = useTranslation();
  const settings = usePublicSettings();
  const whatsappUrl = buildWhatsAppUrl(
    buildGeneralContactMessage(locale),
    settings.whatsappNumber
  );

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-green/[0.06] via-brand-purple/[0.04] to-brand-green/[0.06]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {t("home.contact.title")}
          </h2>
          <p className="mt-4 text-lg text-white/60">{t("home.contact.subtitle")}</p>
        </div>

        <div className="mt-10">
          <ContactTrustSignals />
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <GlassCard className="lg:col-span-3">
            <ContactLeadFormPanel
              locale={locale}
              sourcePage={`/${locale}#contact`}
              serviceOptions={serviceOptions}
            />
          </GlassCard>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{t("contact.whatsappTitle")}</h3>
                  <p className="mt-1 text-sm text-white/50">{t("contact.whatsappDesc")}</p>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                    <Button variant="whatsapp" size="sm">
                      {t("contact.whatsappBtn")}
                    </Button>
                  </a>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-purple/15 text-brand-purple">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="mt-2 block text-sm text-brand-green hover:underline"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-semibold text-white">{t("footer.followUs")}</h3>
              <p className="mt-2 text-sm text-white/50">{t("contact.connectDesc")}</p>
              <SocialLinks links={socialLinks} variant="buttons" className="mt-4" />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
