"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

function measureHeader(element: HTMLElement) {
  const nextHeight = Math.ceil(element.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--header-height", `${nextHeight}px`);
  return nextHeight;
}

function getActiveBar(
  mobileRef: RefObject<HTMLElement | null>,
  desktopRef: RefObject<HTMLElement | null>
) {
  if (typeof window === "undefined") return null;
  return window.matchMedia("(min-width: 1024px)").matches
    ? desktopRef.current
    : mobileRef.current;
}

export function useHeaderHeight(
  mobileRef: RefObject<HTMLElement | null>,
  desktopRef: RefObject<HTMLElement | null>
): number {
  const [height, setHeight] = useState(80);

  useLayoutEffect(() => {
    const update = () => {
      const element = getActiveBar(mobileRef, desktopRef);
      if (element) setHeight(measureHeader(element));
    };

    update();

    const observers: ResizeObserver[] = [];
    [mobileRef.current, desktopRef.current].forEach((element) => {
      if (!element) return;
      const observer = new ResizeObserver(update);
      observer.observe(element);
      observers.push(observer);
    });

    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      observers.forEach((o) => o.disconnect());
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [mobileRef, desktopRef]);

  return height;
}
