"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

export function PwaInstallModal({
  open,
  onInstall,
  onDismiss,
}: {
  open: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/65 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md overflow-hidden rounded-panel border border-line bg-brand-dark shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-green/15 to-transparent" />

            <button
              type="button"
              onClick={onDismiss}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 hover:bg-white/5 hover:text-white"
              aria-label={t("pwa.maybeLater")}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-6 pb-6 pt-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-panel border border-brand-green/25 bg-brand-green/10 shadow-lg shadow-brand-green/10">
                <Image
                  src="/logo-mobile.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>

              <h2
                id="pwa-install-title"
                className="text-lg font-semibold tracking-tight text-white"
              >
                {t("pwa.modalTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">
                {t("pwa.modalMessage")}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Button
                  type="button"
                  className="w-full gap-2"
                  onClick={onInstall}
                >
                  <Download className="h-4 w-4" />
                  {t("pwa.installNow")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full border border-line text-ink-2 hover:text-white"
                  onClick={onDismiss}
                >
                  {t("pwa.maybeLater")}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
