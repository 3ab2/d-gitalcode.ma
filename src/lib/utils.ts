import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatChatTime(date: Date | string, locale = "fr-FR"): string {
  const value = new Date(date);
  const now = new Date();
  const isToday = value.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = value.toDateString() === yesterday.toDateString();

  if (isToday) {
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);
  }

  if (isYesterday) {
    const time = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);
    const label =
      locale.startsWith("ar") ? "أمس" : locale.startsWith("en") ? "Yesterday" : "Hier";
    return `${label} ${time}`;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}
