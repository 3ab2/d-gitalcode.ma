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
      className="fixed bottom-6 end-6 z-40 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-shadow hover:shadow-[#25D366]/50 active:scale-95"
      aria-label={t("floatCta.whatsapp")}
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}
