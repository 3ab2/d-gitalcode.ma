"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PlusSquare, Share, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

function StepCard({
  step,
  icon: Icon,
  label,
  detail,
}: {
  step: number;
  icon: typeof Share;
  label: string;
  detail: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-green/15 text-xs font-bold text-brand-green">
        {step}
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1c1c1e] shadow-inner">
        <Icon className="h-5 w-5 text-[#0a84ff]" strokeWidth={2} />
      </span>
      <span className="min-w-0 pt-0.5">
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-white/45">
          {detail}
        </span>
      </span>
    </li>
  );
}

export function PwaInstallIosModal({
  open,
  onGotIt,
  onDismiss,
}: {
  open: boolean;
  onGotIt: () => void;
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
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/65 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-ios-install-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#1c1c1e] shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0a84ff]/20 to-transparent" />

            <button
              type="button"
              onClick={onDismiss}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70"
              aria-label={t("pwa.maybeLater")}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-5 pb-5 pt-7">
              <div className="mx-auto mb-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.35rem] border border-white/10 bg-black/30 shadow-lg">
                <Image
                  src="/logo-mobile.png"
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-2xl object-contain"
                />
              </div>

              <h2
                id="pwa-ios-install-title"
                className="text-center text-lg font-semibold tracking-tight text-white"
              >
                {t("pwa.iosModalTitle")}
              </h2>
              <p className="mt-2 text-center text-sm leading-relaxed text-white/55">
                {t("pwa.iosModalIntro")}
              </p>

              <ol className="mt-5 space-y-2.5">
                <StepCard
                  step={1}
                  icon={Share}
                  label={t("pwa.iosStep1Title")}
                  detail={t("pwa.iosStep1Detail")}
                />
                <StepCard
                  step={2}
                  icon={PlusSquare}
                  label={t("pwa.iosStep2Title")}
                  detail={t("pwa.iosStep2Detail")}
                />
                <StepCard
                  step={3}
                  icon={Check}
                  label={t("pwa.iosStep3Title")}
                  detail={t("pwa.iosStep3Detail")}
                />
              </ol>

              <div className="mt-5 flex flex-col gap-2">
                <Button
                  type="button"
                  className="w-full rounded-2xl bg-[#0a84ff] text-white hover:bg-[#0a84ff]/90"
                  onClick={onGotIt}
                >
                  {t("pwa.gotIt")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full rounded-2xl border border-white/10 text-white/65 hover:text-white"
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
