"use client";

import Lottie from "lottie-react";
import brandPulse from "@/components/home/hero/brand-pulse.lottie.json";

export function HeroBrandPulse({ active }: { active: boolean }) {
  if (!active) {
    return (
      <span
        className="inline-flex h-8 w-8 shrink-0 rounded-full bg-brand-green/20 ring-2 ring-brand-green/40"
        aria-hidden
      />
    );
  }

  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden>
      <Lottie
        animationData={brandPulse}
        loop
        className="h-10 w-10"
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
      />
    </span>
  );
}
