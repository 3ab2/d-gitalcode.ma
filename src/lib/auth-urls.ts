import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/settings";
import { isAdminRole } from "@/lib/roles";

const PRODUCTION_FALLBACK = "https://d-gitalcodema.vercel.app";

/** Server-side canonical app origin (never localhost in production). */
export function getAuthBaseUrl(): string {
  const candidates = [
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const value of candidates) {
    if (!value?.trim()) continue;
    if (value.includes("localhost")) continue;
    return value.replace(/\/$/, "");
  }

  return PRODUCTION_FALLBACK;
}

export function getLoginPath(locale: string = defaultLocale): string {
  const resolved = isValidLocale(locale) ? locale : defaultLocale;
  return `/${resolved}/login`;
}

export function getSupportPath(locale: string = defaultLocale): string {
  const resolved = isValidLocale(locale) ? locale : defaultLocale;
  return `/${resolved}/support`;
}

export function getPostLoginPath(role: string | undefined | null, locale: string = defaultLocale): string {
  if (isAdminRole(role)) return "/admin";
  return getSupportPath(locale);
}

export function getLogoutPath(locale: string = defaultLocale): string {
  return getLoginPath(locale);
}

export function resolveLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isValidLocale(segment) ? segment : defaultLocale;
}
