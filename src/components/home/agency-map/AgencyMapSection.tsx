"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { Crosshair } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AgencyMapDetailCard } from "@/components/home/agency-map/AgencyMapDetailCard";
import { AgencyMapMobileFallback } from "@/components/home/agency-map/AgencyMapMobileFallback";
import {
  AGENCY_MAP_NODES,
  type AgencyMapNodeId,
} from "@/lib/agency-map/nodes";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { type Locale } from "@/lib/i18n/settings";

const AgencyMapCanvas = dynamic(
  () =>
    import("@/components/home/agency-map/AgencyMapScene").then(
      (mod) => mod.AgencyMapCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[22rem] items-center justify-center rounded-2xl border border-white/10 bg-black/20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    ),
  }
);

export function AgencyMapSection({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [selectedId, setSelectedId] = useState<AgencyMapNodeId | null>(null);
  const [focusToken, setFocusToken] = useState(0);

  const labels = useMemo(
    () =>
      AGENCY_MAP_NODES.reduce(
        (acc, node) => {
          acc[node.id] = t(`home.agencyMap.nodes.${node.id}.title`);
          return acc;
        },
        {} as Record<AgencyMapNodeId, string>
      ),
    [t]
  );

  const handleFocus = useCallback(() => {
    setSelectedId(null);
    setFocusToken((value) => value + 1);
  }, []);

  const showDesktopMap = isDesktop && !prefersReducedMotion;

  return (
    <section
      className="agency-map-section relative overflow-visible py-16 sm:py-20 lg:py-24"
      aria-label={t("home.agencyMap.title")}
      data-testid="agency-map-section"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b from-brand-dark via-[#070b10] to-brand-dark" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden premium-grid opacity-40" />

      <div className="relative z-[1] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("home.agencyMap.title")}
          subtitle={t("home.agencyMap.subtitle")}
          align="center"
        />

        <div className="relative mt-10">
          {!showDesktopMap ? (
            <div className={isDesktop ? "hidden lg:block" : "lg:hidden"}>
              <AgencyMapMobileFallback
                locale={locale}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          ) : (
            <div className="agency-map-stage relative hidden overflow-hidden rounded-3xl border border-white/10 bg-[#070b10] shadow-2xl shadow-black/40 lg:block">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-end gap-2 p-4">
                <button
                  type="button"
                  onClick={handleFocus}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-medium text-white/75 backdrop-blur-md transition-colors hover:border-brand-green/30 hover:text-brand-green"
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  {t("home.agencyMap.focusView")}
                </button>
              </div>

              <div className="relative h-[min(70vh,640px)] min-h-[28rem]">
                <AgencyMapCanvas
                  labels={labels}
                  selectedId={selectedId}
                  onHover={() => undefined}
                  onSelect={setSelectedId}
                  focusToken={focusToken}
                  reducedMotion={prefersReducedMotion}
                />
                <AgencyMapDetailCard
                  locale={locale}
                  selectedId={selectedId}
                  onClose={() => setSelectedId(null)}
                />
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
