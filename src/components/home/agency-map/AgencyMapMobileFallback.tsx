"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AGENCY_MAP_NODES,
  getNodeHref,
  type AgencyMapNodeId,
} from "@/lib/agency-map/nodes";
import { type Locale } from "@/lib/i18n/settings";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function AgencyMapMobileFallback({
  locale,
  selectedId,
  onSelect,
}: {
  locale: Locale;
  selectedId: AgencyMapNodeId | null;
  onSelect: (id: AgencyMapNodeId | null) => void;
}) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="agency-map-mobile-fallback pointer-events-auto space-y-3"
      data-testid="agency-map-mobile-fallback"
    >
      {AGENCY_MAP_NODES.map((node, index) => {
        const active = selectedId === node.id;
        const panelId = `agency-map-panel-${node.id}`;

        return (
          <motion.div
            key={node.id}
            initial={false}
            animate={
              reducedMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05, duration: 0.45, ease: easeOut },
                  }
            }
            className={cn(
              "agency-map-mobile-card overflow-hidden rounded-2xl border border-white/10 bg-[#121a21]/95 transition-colors",
              active && "border-brand-green/30"
            )}
            style={{
              boxShadow: active ? `0 0 24px ${node.emissive}33` : undefined,
              borderColor: active ? `${node.color}66` : undefined,
            }}
          >
            <button
              type="button"
              aria-expanded={active}
              aria-controls={panelId}
              onClick={() => onSelect(active ? null : node.id)}
              className="flex min-h-11 w-full touch-manipulation items-start justify-between gap-3 p-4 text-start transition-colors active:bg-white/[0.03]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {t(`home.agencyMap.nodes.${node.id}.title`)}
                </p>
                {!active && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/55">
                    {t(`home.agencyMap.nodes.${node.id}.description`)}
                  </p>
                )}
              </div>
              <div className="mt-0.5 flex shrink-0 items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: node.color }}
                  aria-hidden
                />
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-white/60 transition-transform duration-200",
                    active && "rotate-180 text-brand-green"
                  )}
                  aria-hidden
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {active && (
                <motion.div
                  id={panelId}
                  initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.28, ease: easeOut }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 border-t border-white/10 px-4 pb-4 pt-3">
                    <p className="text-xs leading-relaxed text-white/65 sm:text-sm">
                      {t(`home.agencyMap.nodes.${node.id}.description`)}
                    </p>
                    <Link
                      href={getNodeHref(locale, node)}
                      className="inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-xl border border-brand-green/25 bg-brand-green/10 px-4 py-2.5 text-xs font-semibold text-brand-green transition-colors active:bg-brand-green/15"
                    >
                      {t("home.agencyMap.exploreService")}
                      <ArrowRight className="rtl:rotate-180 h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
