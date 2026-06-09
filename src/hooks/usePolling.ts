"use client";

import { useEffect, useRef } from "react";

export function usePolling(callback: () => void | Promise<void>, intervalMs = 10000) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      void savedCallback.current();
    };

    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
}
