import { getSiteSettings, upsertSiteSettings } from "@/lib/settings";
import {
  DEFAULT_CURRENCY,
  getCurrencySymbol,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency";

export type PublicCurrencySettings = {
  currency: CurrencyCode;
  symbol: string;
};

export async function getPublicCurrencySettings(): Promise<PublicCurrencySettings> {
  const settings = await getSiteSettings();
  const currency = settings.defaultCurrency;

  return {
    currency,
    symbol: getCurrencySymbol(currency),
  };
}

export async function updateDefaultCurrency(
  currency: string
): Promise<PublicCurrencySettings> {
  if (!isCurrencyCode(currency)) {
    throw new Error("Invalid currency code");
  }

  await upsertSiteSettings({ defaultCurrency: currency });

  return {
    currency,
    symbol: getCurrencySymbol(currency),
  };
}

export function toPublicCurrencySettings(
  currency: CurrencyCode = DEFAULT_CURRENCY
): PublicCurrencySettings {
  return {
    currency,
    symbol: getCurrencySymbol(currency),
  };
}
