"use client";

import { useTranslation } from "react-i18next";
import { useCurrency } from "@/components/providers/PublicSettingsProvider";
import { cn } from "@/lib/utils";

interface FormattedPriceProps {
  amount?: number | null;
  priceLabel?: string | null;
  locale?: string;
  fallback?: string;
  className?: string;
}

/**
 * Renders a service price using the global site currency.
 * Numeric amounts keep their value; only the symbol/format changes.
 */
export function FormattedPrice({
  amount,
  priceLabel,
  locale,
  fallback,
  className,
}: FormattedPriceProps) {
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();

  const text =
    priceLabel?.trim() ||
    (amount != null ? formatPrice(amount, locale) : fallback ?? t("home.services.custom"));

  return <span className={cn(className)}>{text}</span>;
}
