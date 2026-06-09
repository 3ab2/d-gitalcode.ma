"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Locale, localeNames, locales } from "@/lib/i18n/settings";
import { Button } from "@/components/ui/Button";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { AuthNav } from "@/components/layout/AuthNav";

export function Header({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuPortalReady, setMenuPortalReady] = useState(false);
  const mobileBarRef = useRef<HTMLElement>(null);
  const desktopBarRef = useRef<HTMLElement>(null);
  const headerHeight = useHeaderHeight(mobileBarRef, desktopBarRef);

  const basePath = `/${locale}`;

  const navLinks = [
    { href: basePath, label: t("nav.home") },
    {
      label: t("nav.services"),
      children: [
        { href: `${basePath}/services/web-development`, label: t("nav.webDev") },
        { href: `${basePath}/services/mobile-apps`, label: t("nav.mobileApps") },
        { href: `${basePath}/services/wordpress-plugins`, label: t("nav.wpPlugins") },
        { href: `${basePath}/services/wordpress-templates`, label: t("nav.wpTemplates") },
      ],
    },
    { href: `${basePath}/portfolio`, label: t("nav.portfolio") },
    { href: `${basePath}/about`, label: t("nav.about") },
    { href: `${basePath}/blog`, label: t("nav.blog") },
    { href: `${basePath}/contact`, label: t("nav.contact") },
  ];

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMobileOpen((open) => !open);
  }, []);

  useEffect(() => {
    setMenuPortalReady(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const mobileMenuPanel = (
    <>
      <button
        type="button"
        aria-label="Close menu overlay"
        className="site-menu-overlay fixed inset-x-0 bottom-0 cursor-pointer bg-black/60 lg:hidden"
        style={{ top: headerHeight, zIndex: 9997 }}
        onClick={closeMenu}
      />
      <nav
        id="mobile-navigation"
        className="site-mobile-nav fixed inset-x-0 overflow-y-auto border-t border-white/10 bg-brand-dark lg:hidden"
        style={{ top: headerHeight, zIndex: 9998, maxHeight: `calc(100dvh - ${headerHeight}px)` }}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  type="button"
                  onClick={() => setServicesOpen((open) => !open)}
                  className="flex min-h-11 w-full cursor-pointer touch-manipulation items-center justify-between rounded-lg px-4 py-3 text-white/80 active:bg-white/5"
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      servicesOpen && "rotate-180"
                    )}
                  />
                </button>
                {servicesOpen && (
                  <div className="space-y-1 ps-4">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenu}
                        className="block min-h-11 cursor-pointer touch-manipulation rounded-lg px-4 py-3 text-sm text-white/65 active:bg-white/5 active:text-brand-green"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                onClick={closeMenu}
                className="block min-h-11 cursor-pointer touch-manipulation rounded-lg px-4 py-3 text-white/80 active:bg-white/5 active:text-white"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="flex gap-2 border-t border-white/10 pt-4">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                onClick={closeMenu}
                className={cn(
                  "min-h-11 flex-1 cursor-pointer touch-manipulation rounded-lg border py-3 text-center text-xs",
                  l === locale
                    ? "border-brand-green/30 bg-brand-green/10 text-brand-green"
                    : "border-white/10 text-white/50"
                )}
              >
                {localeNames[l]}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <AuthNav locale={locale} />
          </div>
          <Link href={`${basePath}/contact`} onClick={closeMenu} className="mt-4 block">
            <Button className="w-full">{t("nav.contact")}</Button>
          </Link>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile navbar — rendered in React tree (reliable on iOS Safari/Chrome) */}
      <header
        ref={mobileBarRef}
        className="site-header site-header-mobile site-header-bar border-b border-white/[0.06] bg-brand-dark lg:hidden"
      >
        <div className="mx-auto flex h-16 min-h-16 items-center justify-between px-4 sm:px-6 md:h-20 md:min-h-20">
          <Link
            href={basePath}
            className="flex h-14 shrink-0 items-center md:h-16"
            aria-label="D-GITALCODE"
          >
            <Logo size="md" priority />
          </Link>

          <button
            type="button"
            className="menu-toggle flex h-11 min-h-11 w-11 min-w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/10 active:bg-white/15"
            onClick={toggleMenu}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? (
              <X className="pointer-events-none h-6 w-6" aria-hidden />
            ) : (
              <Menu className="pointer-events-none h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </header>

      {/* Desktop navbar */}
      <header
        ref={desktopBarRef}
        className="site-header site-header-desktop site-header-bar hidden border-b border-white/[0.06] bg-brand-dark/95 backdrop-blur-xl lg:block"
      >
        <div className="mx-auto flex h-[5.625rem] min-h-[5.625rem] max-w-7xl items-center justify-between gap-4 px-8">
          <Link href={basePath} className="flex shrink-0 items-center" aria-label="D-GITALCODE">
            <Logo size="md" priority />
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="group relative">
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1 px-3.5 py-2 text-sm font-medium text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[220px] rounded-xl border border-white/10 bg-brand-dark/95 p-2 shadow-xl backdrop-blur-xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-lg px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-brand-green"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-brand-green"
                      : "text-white/65 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-white/10 p-1">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs transition-colors",
                    l === locale
                      ? "bg-brand-green/20 text-brand-green"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>

            <AuthNav locale={locale} />
            <Link href={`${basePath}/contact`}>
              <Button size="sm">{t("nav.contact")}</Button>
            </Link>
          </div>
        </div>
      </header>

      {menuPortalReady && mobileOpen ? createPortal(mobileMenuPanel, document.body) : null}
    </>
  );
}
