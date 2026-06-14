"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import {
  getNodeById,
  getNodeHref,
  type AgencyMapNodeId,
} from "@/lib/agency-map/nodes";
import { type Locale } from "@/lib/i18n/settings";

export function AgencyMapDetailCard({
  locale,
  selectedId,
  onClose,
}: {
  locale: Locale;
  selectedId: AgencyMapNodeId | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const node = selectedId ? getNodeById(selectedId) : null;

  return (
    <AnimatePresence>
      {node && selectedId && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="agency-map-detail pointer-events-auto absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl sm:inset-x-auto sm:end-6 sm:bottom-6 sm:w-[min(100%,22rem)]"
          style={{ boxShadow: `0 0 40px ${node.emissive}22` }}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">
                {t("home.agencyMap.serviceLabel")}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {t(`home.agencyMap.nodes.${selectedId}.title`)}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              aria-label={t("home.agencyMap.close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-white/65">
            {t(`home.agencyMap.nodes.${selectedId}.description`)}
          </p>

          <Link href={getNodeHref(locale, node)} className="mt-5 block">
            <Button size="md" className="hero-cta-glow w-full">
              {t("home.agencyMap.exploreService")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
