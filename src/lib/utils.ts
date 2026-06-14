import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { formatPrice, formatBudgetRangeLabel, getCurrencySymbol, resolveDisplayPrice } from "@/lib/currency";

export function formatDate(date: Date | string, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(
  date: Date | string,
  locale = "fr-FR"
): string {
  const value = new Date(date);
  const now = Date.now();
  const diffSec = Math.floor((now - value.getTime()) / 1000);

  if (diffSec < 60) return locale.startsWith("ar") ? "الآن" : locale.startsWith("en") ? "Just now" : "À l'instant";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    if (locale.startsWith("ar")) return `منذ ${diffMin} د`;
    if (locale.startsWith("en")) return `${diffMin}m ago`;
    return `il y a ${diffMin} min`;
  }
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    if (locale.startsWith("ar")) return `منذ ${diffHour} س`;
    if (locale.startsWith("en")) return `${diffHour}h ago`;
    return `il y a ${diffHour} h`;
  }
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) {
    if (locale.startsWith("ar")) return `منذ ${diffDay} ي`;
    if (locale.startsWith("en")) return `${diffDay}d ago`;
    return `il y a ${diffDay} j`;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(value);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
