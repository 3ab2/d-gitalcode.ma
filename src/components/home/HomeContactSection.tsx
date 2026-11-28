"use client";

import { useTranslation } from "react-i18next";
import { ContactLeadFormPanel } from "@/components/contact/ContactLeadFormPanel";
import { ContactTrustSignals } from "@/components/contact/ContactTrustSignals";
import { SocialLinks } from "@/components/social/SocialLinks";
import { buttonClasses } from "@/components/ui/Button";
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
  const whatsappUrl = buildWhatsAppUrl(buildGeneralContactMessage(locale), settings.whatsappNumber);

  return (
    <section id="contact" className="section-y border-t border-line">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 className="max-w-[14ch] text-heading text-ink">{t("home.contact.title")}</h2>
          <p className="mt-5 max-w-md text-lead text-ink-2">{t("home.contact.subtitle")}</p>

          <ContactTrustSignals className="mt-10" />

          <div className="mt-10">
            <h3 className="font-medium text-ink">{t("contact.whatsappTitle")}</h3>
            <p className="mt-1.5 max-w-sm text-sm text-ink-2">{t("contact.whatsappDesc")}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "md")}>
                {t("contact.whatsappBtn")}
              </a>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-sm text-ink-2 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
              >
                {settings.contactEmail}
              </a>
            </div>
          </div>

          <SocialLinks links={socialLinks} className="mt-8" />
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-panel border border-line bg-surface p-6 sm:p-8 lg:p-10">
            <ContactLeadFormPanel locale={locale} sourcePage={`/${locale}#contact`} serviceOptions={serviceOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
