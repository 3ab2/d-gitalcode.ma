"use client";

import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { type Locale } from "@/lib/i18n/settings";
import { usePublicSettings } from "@/components/providers/PublicSettingsProvider";

export function WhatsAppFloat({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const settings = usePublicSettings();
  const url = buildWhatsAppUrl(
    buildGeneralContactMessage(locale),
    settings.whatsappNumber
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-40 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-shadow hover:shadow-[#25D366]/50 active:scale-95"
      aria-label={t("whatsapp.float")}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
