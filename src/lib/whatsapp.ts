import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export function buildWhatsAppUrl(
  message: string,
  whatsappNumber?: string
): string {
  const number =
    whatsappNumber?.replace(/\D/g, "") ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    DEFAULT_SITE_SETTINGS.whatsappNumber;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function buildServiceRequestMessage(
  serviceName: string,
  locale: string
): string {
  const messages: Record<string, string> = {
    fr: `Bonjour D-GITALCODE, je souhaite demander : ${serviceName}`,
    en: `Hello D-GITALCODE, I want to request: ${serviceName}`,
    ar: `مرحباً D-GITALCODE، أريد طلب: ${serviceName}`,
  };
  return messages[locale] || messages.fr;
}

export function buildGeneralContactMessage(locale: string): string {
  const messages: Record<string, string> = {
    fr: "Bonjour D-GITALCODE, je souhaite discuter d'un projet.",
    en: "Hello D-GITALCODE, I'd like to discuss a project.",
    ar: "مرحباً D-GITALCODE، أود مناقشة مشروع.",
  };
  return messages[locale] || messages.fr;
}
