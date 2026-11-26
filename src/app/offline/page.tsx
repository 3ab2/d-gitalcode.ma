"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCw, WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";

const copy = {
  fr: {
    title: "Vous êtes hors ligne",
    subtitle: "Vérifiez votre connexion internet et réessayez.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
  en: {
    title: "You're currently offline",
    subtitle: "Check your internet connection and try again.",
    retry: "Retry",
    home: "Return Home",
  },
  ar: {
    title: "أنت غير متصل",
    subtitle: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى.",
    retry: "إعادة المحاولة",
    home: "العودة للرئيسية",
  },
} as const;

const subscribe = () => () => {};

function resolveLocale(): keyof typeof copy {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ar")) return "ar";
  if (lang.startsWith("en")) return "en";
  return "fr";
}

export default function OfflinePage() {
  // The server renders French; the browser language applies after hydration.
  const locale = useSyncExternalStore(subscribe, resolveLocale, () => "fr" as const);
  const t = copy[locale];
  const homeHref = `/${locale}`;

  return (
    <main
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-brand-dark px-6 text-center"
    >
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-panel border border-line bg-surface shadow-xl shadow-black/30">
        <WifiOff className="h-9 w-9 text-action" aria-hidden />
      </div>

      <Image
        src="/logo-mobile.png"
        alt="D-GITALCODE"
        width={200}
        height={64}
        className="mb-8 h-14 w-auto"
        priority
      />

      <h1 className="text-2xl font-bold text-white">{t.title}</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-3">{t.subtitle}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 rounded-control bg-brand-green px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-green/90"
        >
          <RefreshCw className="h-4 w-4" />
          {t.retry}
        </button>
        <Link
          href={homeHref}
          className="inline-flex items-center justify-center rounded-control border border-white/15 px-6 py-3 text-sm font-medium text-ink-2 transition hover:border-brand-green/30 hover:text-white"
        >
          {t.home}
        </Link>
      </div>
    </main>
  );
}
