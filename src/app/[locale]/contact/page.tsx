import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { PageHero } from "@/components/ui/PageHero";
import { ContactLeadFormPanel } from "@/components/contact/ContactLeadFormPanel";
import { ContactTrustSignals } from "@/components/contact/ContactTrustSignals";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { SocialLinks } from "@/components/social/SocialLinks";
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
    <>
      <PageHero title={t("contact.title")} lead={t("contact.headline")} />

      <section className="section-y">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="rounded-panel border border-line bg-surface p-6 sm:p-8 lg:p-10">
              <ContactLeadFormPanel locale={loc} sourcePage={`/${loc}/contact`} serviceOptions={serviceOptions} />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="text-subheading text-ink">{t("contact.whatsappTitle")}</h2>
            <p className="mt-3 text-ink-2">{t("contact.whatsappDesc")}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "lg", "mt-6 w-full sm:w-auto")}
            >
              {t("contact.whatsappBtn")}
            </a>

            <ul className="mt-10 space-y-3 border-t border-line pt-8 text-ink-2">
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
                >
                  {settings.contactEmail}
                </a>
              </li>
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} dir="ltr" className="transition-colors hover:text-ink">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && <li>{settings.address}</li>}
            </ul>

            <ContactTrustSignals className="mt-10" />

            <SocialLinks links={socialLinks} className="mt-10" />
          </aside>
        </div>
      </section>
    </>
  );
}
