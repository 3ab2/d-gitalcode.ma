"use client";

import { useEffect } from "react";
import { SerwistProvider as Provider } from "@serwist/turbopack/react";

const isDev = process.env.NODE_ENV === "development";

export function SerwistProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isDev || !("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        void registration.unregister();
      }
    });
  }, []);

  return (
    <Provider swUrl="/serwist/sw.js" disable={isDev}>
      {children}
    </Provider>
  );
}
