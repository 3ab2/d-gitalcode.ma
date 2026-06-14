import type { BudgetRange } from "@/lib/contact-validation";
import type { Locale } from "@/lib/i18n/settings";

export const SUPPORTED_CURRENCIES = ["MAD", "EUR", "USD"] as const;
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: CurrencyCode = "MAD";

export const CURRENCY_META: Record<
  CurrencyCode,
  { code: CurrencyCode; name: string; symbol: string }
> = {
  MAD: { code: "MAD", name: "Moroccan Dirham", symbol: "DH" },
  EUR: { code: "EUR", name: "Euro", symbol: "€" },
  USD: { code: "USD", name: "US Dollar", symbol: "$" },
};

export const CURRENCY_OPTIONS = SUPPORTED_CURRENCIES.map((code) => ({
  ...CURRENCY_META[code],
}));

export function isCurrencyCode(value: string): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.includes(value as CurrencyCode);
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_META[currency].symbol;
}

export function toIntlLocale(locale: string): string {
  if (locale.startsWith("ar")) return "ar-MA";
  if (locale.startsWith("en")) return "en-US";
  return "fr-FR";
}

function formatNumber(price: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Formats a numeric price using the configured currency (symbol only, no FX conversion). */
export function formatPrice(
  price: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  locale = "fr-FR"
): string {
  const intlLocale = toIntlLocale(locale);
  const formatted = formatNumber(price, intlLocale);

  switch (currency) {
    case "MAD":
      return `${formatted} ${CURRENCY_META.MAD.symbol}`;
    case "EUR":
      return intlLocale.startsWith("en")
        ? `${CURRENCY_META.EUR.symbol}${formatted}`
        : `${formatted} ${CURRENCY_META.EUR.symbol}`;
    case "USD":
      return intlLocale.startsWith("fr") || intlLocale.startsWith("ar")
        ? `${formatted} ${CURRENCY_META.USD.symbol}`
        : `${CURRENCY_META.USD.symbol}${formatted}`;
    default:
      return `${formatted} ${getCurrencySymbol(currency)}`;
  }
}

/** Prefer explicit priceLabel; otherwise format numeric amount with global currency. */
export function resolveDisplayPrice(
  amount: number | null | undefined,
  priceLabel: string | null | undefined,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  locale = "fr-FR"
): string | null {
  if (priceLabel?.trim()) return priceLabel.trim();
  if (amount == null) return null;
  return formatPrice(amount, currency, locale);
}

const NOT_SURE_LABELS: Record<Locale, string> = {
  fr: "Je ne sais pas encore",
  en: "Not sure yet",
  ar: "لست متأكداً بعد",
};

function resolveContentLocale(locale: string): Locale {
  if (locale.startsWith("ar")) return "ar";
  if (locale.startsWith("en")) return "en";
  return "fr";
}

/** Formats lead budget range labels using the site default currency. */
export function formatBudgetRangeLabel(
  range: BudgetRange,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  locale: string = "fr"
): string {
  const contentLocale = resolveContentLocale(locale);

  if (range === "not_sure") {
    return NOT_SURE_LABELS[contentLocale];
  }

  const under500 = formatPrice(500, currency, locale);
  const from500 = formatPrice(500, currency, locale);
  const to2000 = formatPrice(2000, currency, locale);
  const from2000 = formatPrice(2000, currency, locale);
  const to5000 = formatPrice(5000, currency, locale);
  const over5000 = formatPrice(5000, currency, locale);

  const templates: Record<Locale, Record<Exclude<BudgetRange, "not_sure">, string>> = {
    fr: {
      under_500: `Moins de ${under500}`,
      "500_2000": `${from500} – ${to2000}`,
      "2000_5000": `${from2000} – ${to5000}`,
      "5000_plus": `Plus de ${over5000}`,
    },
    en: {
      under_500: `Under ${under500}`,
      "500_2000": `${from500} – ${to2000}`,
      "2000_5000": `${from2000} – ${to5000}`,
      "5000_plus": `Over ${over5000}`,
    },
    ar: {
      under_500: `أقل من ${under500}`,
      "500_2000": `${from500} – ${to2000}`,
      "2000_5000": `${from2000} – ${to5000}`,
      "5000_plus": `أكثر من ${over5000}`,
    },
  };

  return templates[contentLocale][range];
}
