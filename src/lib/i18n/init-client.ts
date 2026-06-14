"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale } from "@/lib/i18n/settings";

/**
 * Client-only fallback i18n instance for components outside I18nextProvider
 * (e.g. PWA modals in the root layout). Must not be imported from Server Components.
 */
if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    resources: {},
    partialBundledLanguages: true,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    initAsync: false,
  });
}

export { i18n as defaultI18n };
