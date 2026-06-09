"use client";

import { signOut } from "next-auth/react";
import { getLogoutPath, resolveLocaleFromPathname } from "@/lib/auth-urls";
import { defaultLocale, type Locale } from "@/lib/i18n/settings";

/**
 * Sign out without relying on AUTH_URL / NEXTAUTH_URL for redirects.
 * Always navigates to the locale login page on the current origin.
 */
export async function logoutToLogin(locale?: Locale | string) {
  const resolved =
    locale ||
    (typeof window !== "undefined"
      ? resolveLocaleFromPathname(window.location.pathname)
      : defaultLocale);

  const loginPath = getLogoutPath(resolved);

  await signOut({ redirect: false });
  window.location.assign(loginPath);
}
