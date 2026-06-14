"use client";

import { useTranslation } from "react-i18next";
import { ClientContactForm } from "@/components/contact/ClientContactForm";
import type { ContactServiceOption } from "@/lib/contact-form-options";
import { type Locale } from "@/lib/i18n/settings";

type ContactLeadFormPanelProps = {
  locale: Locale;
  sourcePage: string;
  serviceOptions: ContactServiceOption[];
};

/**
 * Shared contact/lead form block used on the Contact page and Homepage.
 * Single component → /api/contact → Admin Leads pipeline.
 */
export function ContactLeadFormPanel({
  locale,
  sourcePage,
  serviceOptions,
}: ContactLeadFormPanelProps) {
  const { t } = useTranslation();

  return (
    <>
      <p className="mb-6 text-sm text-white/60">{t("contact.promise")}</p>
      <ClientContactForm
        locale={locale}
        sourcePage={sourcePage}
        serviceOptions={serviceOptions}
      />
    </>
  );
}
