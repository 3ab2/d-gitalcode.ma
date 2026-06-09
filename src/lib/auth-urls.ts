import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/settings";
import { isAdminRole } from "@/lib/roles";

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
