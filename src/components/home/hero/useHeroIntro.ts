"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const SKIP_STORAGE_KEY = "dgitalcode-hero-intro-skipped";
const INTRO_DURATION_MS = 2200;
const INTRO_DURATION_MOBILE_MS = 600;

function subscribeNoop() {
  return () => {};
}

function readStoredSkip(): boolean {
  return localStorage.getItem(SKIP_STORAGE_KEY) === "1";
}

export function useHeroIntro() {
  const reducedMotion = useReducedMotion();
  const [manuallySkipped, setManuallySkipped] = useState(false);
  const storedSkipped = useSyncExternalStore(
    subscribeNoop,
    readStoredSkip,
    () => false
  );
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const skipped = storedSkipped || manuallySkipped;
  const prefersReducedMotion = Boolean(reducedMotion);
  const [timedComplete, setTimedComplete] = useState(
    () => storedSkipped || prefersReducedMotion
  );

  useEffect(() => {
    if (!hydrated || skipped || reducedMotion) return;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const delay = isCoarsePointer ? INTRO_DURATION_MOBILE_MS : INTRO_DURATION_MS;

    const timer = window.setTimeout(() => {
      setTimedComplete(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [hydrated, skipped, reducedMotion]);

  const skipIntro = useCallback(() => {
    setManuallySkipped(true);
    setTimedComplete(true);
    localStorage.setItem(SKIP_STORAGE_KEY, "1");
  }, []);

  const introComplete = skipped || prefersReducedMotion || timedComplete;
  const animateIntro = hydrated && !skipped && !reducedMotion && !introComplete;

  return {
    hydrated,
    skipped,
    introComplete,
    animateIntro,
    reducedMotion: prefersReducedMotion,
    skipIntro,
  };
}
