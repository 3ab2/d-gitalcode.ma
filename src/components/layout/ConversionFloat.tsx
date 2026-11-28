"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { sendAnalyticsEvent } from "@/lib/analytics/client";
import { type Locale } from "@/lib/i18n/settings";
import { usePublicSettings } from "@/components/providers/PublicSettingsProvider";

const HIDDEN_PATH_SUFFIXES = ["/contact"];

export function ConversionFloat({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const settings = usePublicSettings();

  const hidden = useMemo(
    () => HIDDEN_PATH_SUFFIXES.some((suffix) => pathname.endsWith(suffix)),
    [pathname]
  );

  const whatsappUrl = buildWhatsAppUrl(
    buildGeneralContactMessage(locale),
    settings.whatsappNumber
  );

  if (hidden) return null;

  const handleWhatsAppClick = () => {
    sendAnalyticsEvent("cta_whatsapp_click", pathname, { locale, source: "float" });
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleWhatsAppClick}
      className="fixed bottom-5 end-5 z-40 flex h-12 w-12 touch-manipulation items-center justify-center rounded-full bg-action text-on-action shadow-overlay transition-colors hover:bg-action-hover sm:bottom-6 sm:end-6"
      aria-label={t("floatCta.whatsapp")}
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}
