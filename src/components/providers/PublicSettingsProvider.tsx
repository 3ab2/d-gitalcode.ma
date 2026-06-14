"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  formatBudgetRangeLabel,
  formatPrice as formatPriceWithCurrency,
  getCurrencySymbol,
  type CurrencyCode,
} from "@/lib/currency";
import { CURRENCY_UPDATED_EVENT, type CurrencyUpdatedDetail } from "@/lib/currency/broadcast";
import type { BudgetRange } from "@/lib/contact-validation";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/site-settings";

type PublicSettingsContextValue = {
  settings: SiteSettings;
  refreshCurrency: () => Promise<void>;
};

const PublicSettingsContext = createContext<PublicSettingsContextValue>({
  settings: DEFAULT_SITE_SETTINGS,
  refreshCurrency: async () => {},
});

export function PublicSettingsProvider({
  settings: initialSettings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const [liveCurrency, setLiveCurrency] = useState<CurrencyCode | null>(null);

  const settings = useMemo<SiteSettings>(
    () => ({
      ...initialSettings,
      defaultCurrency: liveCurrency ?? initialSettings.defaultCurrency,
    }),
    [initialSettings, liveCurrency]
  );

  const refreshCurrency = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/currency", { cache: "no-store" });
      if (!res.ok) return;

      const data = (await res.json()) as { currency: CurrencyCode };
      setLiveCurrency(data.currency);
    } catch {
      /* non-blocking sync */
    }
  }, []);

  useEffect(() => {
    const onCurrencyUpdated = (event: Event) => {
      const { currency } = (event as CustomEvent<CurrencyUpdatedDetail>).detail;
      setLiveCurrency(currency);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshCurrency();
      }
    };

    window.addEventListener(CURRENCY_UPDATED_EVENT, onCurrencyUpdated);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener(CURRENCY_UPDATED_EVENT, onCurrencyUpdated);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refreshCurrency]);

  const value = useMemo(
    () => ({ settings, refreshCurrency }),
    [settings, refreshCurrency]
  );

  return (
    <PublicSettingsContext.Provider value={value}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings(): SiteSettings {
  return useContext(PublicSettingsContext).settings;
}

export function useCurrency() {
  const { settings } = useContext(PublicSettingsContext);
  const { defaultCurrency } = settings;

  const formatPrice = useCallback(
    (price: number, locale?: string) =>
      formatPriceWithCurrency(price, defaultCurrency, locale),
    [defaultCurrency]
  );

  const formatBudgetRange = useCallback(
    (range: BudgetRange, locale?: string) =>
      formatBudgetRangeLabel(range, defaultCurrency, locale),
    [defaultCurrency]
  );

  return {
    currency: defaultCurrency,
    symbol: getCurrencySymbol(defaultCurrency),
    formatPrice,
    formatBudgetRange,
  };
}

export function useCurrencySettings() {
  const { settings, refreshCurrency } = useContext(PublicSettingsContext);
  const { defaultCurrency } = settings;

  return {
    currency: defaultCurrency,
    symbol: getCurrencySymbol(defaultCurrency),
    refreshCurrency,
  };
}
