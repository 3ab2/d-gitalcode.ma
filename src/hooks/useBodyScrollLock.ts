"use client";

import { useEffect, useRef } from "react";

/**
 * Locks page scroll while keeping iOS Safari touch interaction stable.
 * Avoids `position: fixed` on body, which breaks fixed headers and tap targets.
 */
export function useBodyScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!locked) return;

    scrollYRef.current = window.scrollY;
    const { documentElement, body } = document;

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    return () => {
      documentElement.style.overflow = "";
      body.style.overflow = "";
      body.style.touchAction = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [locked]);
}
