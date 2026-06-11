import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { defaultLocale, type Locale } from "./settings";

const initI18next = async (locale: Locale) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../../messages/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      supportedLngs: ["fr", "en", "ar"],
      defaultNS: "common",
      ns: ["common"],
    });
  return i18nInstance;
};

export async function getMessages(locale: Locale, ns = "common") {
  const messagesModule = await import(`../../../messages/${locale}/${ns}.json`);
  return messagesModule.default;
}

export async function getTranslation(locale: Locale, ns = "common") {
  const i18nextInstance = await initI18next(locale);
  return {
    t: i18nextInstance.getFixedT(locale, ns),
    i18n: i18nextInstance,
  };
}
