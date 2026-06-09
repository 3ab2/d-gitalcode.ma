"use client";

import { useMemo } from "react";
import { createInstance, type i18n } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/settings";

function createI18nInstance(locale: Locale, messages: Record<string, unknown>): i18n {
  const instance = createInstance();

  instance.use(initReactI18next).init({
    lng: locale,
    resources: { [locale]: { common: messages } },
    fallbackLng: defaultLocale,
    supportedLngs: [...locales],
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  return instance;
}

export function I18nProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
}) {
  const i18n = useMemo(
    () => createI18nInstance(locale, messages),
    [locale, messages]
  );

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
