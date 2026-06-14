"use client";

import { createContext, useCallback, useContext } from "react";
import {
  formatBudgetRangeLabel,
  formatPrice as formatPriceWithCurrency,
  getCurrencySymbol,
  type CurrencyCode,
} from "@/lib/currency";
import type { BudgetRange } from "@/lib/contact-validation";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/site-settings";

const PublicSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function PublicSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <PublicSettingsContext.Provider value={settings}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings(): SiteSettings {
  return useContext(PublicSettingsContext);
}

export function useCurrency() {
  const { defaultCurrency } = usePublicSettings();

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
    currency: defaultCurrency as CurrencyCode,
    symbol: getCurrencySymbol(defaultCurrency),
    formatPrice,
    formatBudgetRange,
  };
}
