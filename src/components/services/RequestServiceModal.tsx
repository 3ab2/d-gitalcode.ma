"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { X, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildServiceRequestMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { sendAnalyticsEvent } from "@/lib/analytics/client";
import { type Locale } from "@/lib/i18n/settings";
import { usePublicSettings } from "@/components/providers/PublicSettingsProvider";

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  serviceId: string;
  serviceName: string;
}

export function RequestServiceModal({
  isOpen,
  onClose,
  locale,
  serviceId,
  serviceName,
}: RequestServiceModalProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const settings = usePublicSettings();
  const [mode, setMode] = useState<"choose" | "form">("choose");

  const whatsappUrl = buildWhatsAppUrl(
    buildServiceRequestMessage(serviceName, locale),
    settings.whatsappNumber
  );
  const sourcePage = pathname || `/services`;

  const handleWhatsAppClick = async () => {
    sendAnalyticsEvent("cta_whatsapp_click", sourcePage, {
      locale,
      serviceName,
      source: "service_modal",
    });

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "WhatsApp User",
        email: "whatsapp@redirect.local",
        message: buildServiceRequestMessage(serviceName, locale),
        locale,
        type: "SERVICE_REQUEST",
        method: "WHATSAPP",
        serviceId,
        serviceName,
        sourcePage,
      }),
    });
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-brand-dark p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-2 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              {t("request.title")}
            </h3>
            <p className="text-sm text-white/50 mb-6">{serviceName}</p>

            {mode === "choose" ? (
              <div className="space-y-4">
                <p className="text-sm text-white/70">{t("request.choose")}</p>
                <button
                  onClick={() => setMode("form")}
                  className="flex w-full items-center gap-4 rounded-xl border border-white/10 p-4 hover:border-brand-green/30 hover:bg-white/5 transition-colors text-start"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{t("request.form")}</div>
                    <div className="text-sm text-white/50">{t("request.formDesc")}</div>
                  </div>
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="flex w-full items-center gap-4 rounded-xl border border-white/10 p-4 hover:border-[#25D366]/30 hover:bg-white/5 transition-colors text-start"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{t("request.whatsapp")}</div>
                    <div className="text-sm text-white/50">{t("request.whatsappDesc")}</div>
                  </div>
                </button>
              </div>
            ) : (
              <ContactForm
                locale={locale}
                serviceId={serviceId}
                serviceName={serviceName}
                type="SERVICE_REQUEST"
                sourcePage={sourcePage}
                onSuccess={onClose}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
