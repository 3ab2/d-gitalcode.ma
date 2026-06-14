import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale, locales } from "@/lib/i18n/settings";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacyMessages = pathname.match(/^\/(fr|en|ar)\/messages(\/.*)?$/);
  if (legacyMessages) {
    return NextResponse.redirect(
      new URL(`/${legacyMessages[1]}/contact`, request.url)
    );
  }

  const removedAuthPaths = pathname.match(
    /^\/(fr|en|ar)\/(login|register|support)(\/.*)?$/
  );
  if (removedAuthPaths) {
    return NextResponse.redirect(
      new URL(`/${removedAuthPaths[1]}`, request.url)
    );
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/serwist") ||
    pathname === "/offline" ||
    pathname.startsWith("/offline/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
    const resolvedLocale = isValidLocale(locale) ? locale : defaultLocale;
    return NextResponse.redirect(
      new URL(`/${resolvedLocale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|serwist|logo-mobile|logo-desktop|hero).*)",
  ],
};
