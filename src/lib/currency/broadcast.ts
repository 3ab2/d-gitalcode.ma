import { getCurrencySymbol, type CurrencyCode } from "@/lib/currency";

export const CURRENCY_UPDATED_EVENT = "dgitalcode:currency-updated";

export type CurrencyUpdatedDetail = {
  currency: CurrencyCode;
  symbol: string;
};

export function broadcastCurrencyUpdate(currency: CurrencyCode): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<CurrencyUpdatedDetail>(CURRENCY_UPDATED_EVENT, {
      detail: {
        currency,
        symbol: getCurrencySymbol(currency),
      },
    })
  );
}
