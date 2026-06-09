import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { defaultLocale, isValidLocale, locales } from "@/lib/i18n/settings";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      if ((session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale =
      request.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
    const resolvedLocale = isValidLocale(locale) ? locale : defaultLocale;
    return NextResponse.redirect(
      new URL(`/${resolvedLocale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo-mobile|logo-desktop|hero).*)"],
};
