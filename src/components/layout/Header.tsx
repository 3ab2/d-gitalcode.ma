"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Locale, localeNames, locales } from "@/lib/i18n/settings";
import { Button } from "@/components/ui/Button";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export function Header({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuOpenedAtRef = useRef(0);
  const mobileBarRef = useRef<HTMLElement>(null);
  const desktopBarRef = useRef<HTMLElement>(null);
  const headerHeight = useHeaderHeight(mobileBarRef, desktopBarRef);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useBodyScrollLock(mobileOpen && !isDesktop);

  const basePath = `/${locale}`;

  const navLinks = [
    { href: basePath, label: t("nav.home") },
    {
      label: t("nav.services"),
      children: [
        { href: `${basePath}/services`, label: t("nav.allServices") },
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

  const handleMobileNavClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const toggleMenu = useCallback(() => {
    setMobileOpen((open) => {
      if (!open) menuOpenedAtRef.current = Date.now();
      return !open;
    });
  }, []);

  const handleOverlayClose = useCallback(() => {
    if (Date.now() - menuOpenedAtRef.current < 350) return;
    closeMenu();
  }, [closeMenu]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMobileOpen(false);
      setServicesOpen(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen && !servicesOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, servicesOpen, closeMenu]);

  const mobileMenuPanel = mobileOpen && !isDesktop && (
    <>
      <button
        type="button"
        aria-label={t("a11y.closeMenu")}
        className="site-menu-overlay fixed inset-x-0 bottom-0 cursor-pointer bg-black/60 touch-manipulation lg:hidden"
        style={{ top: headerHeight, zIndex: 10101 }}
        onClick={handleOverlayClose}
      />
      <nav
        id="mobile-navigation"
        aria-label={t("a11y.mainNavigation")}
        className="site-mobile-nav fixed inset-x-0 overflow-y-auto overscroll-contain border-t border-line bg-bg lg:hidden"
        style={{ top: headerHeight, zIndex: 10102, maxHeight: `calc(100dvh - ${headerHeight}px)` }}
      >
        <div className="container-site pt-2 pb-8">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  type="button"
                  onClick={() => setServicesOpen((open) => !open)}
                  className="flex min-h-14 w-full cursor-pointer touch-manipulation items-center justify-between border-b border-line py-3 text-lg text-ink"
                  aria-expanded={servicesOpen}
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
                  <div className="border-b border-line py-2 ps-4">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={handleMobileNavClick}
                        className="block min-h-11 cursor-pointer touch-manipulation py-2.5 text-base text-ink-2 active:text-ink"
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
                onClick={handleMobileNavClick}
                className="flex min-h-14 cursor-pointer touch-manipulation items-center border-b border-line py-3 text-lg text-ink"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="mt-6 flex gap-2">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                hrefLang={l}
                lang={l}
                aria-current={l === locale ? "true" : undefined}
                onClick={handleMobileNavClick}
                className={cn(
                  "min-h-11 flex-1 cursor-pointer touch-manipulation rounded-control border py-3 text-center text-sm",
                  l === locale
                    ? "border-line-strong bg-white/[0.06] text-ink"
                    : "border-line text-ink-3"
                )}
              >
                {localeNames[l]}
              </Link>
            ))}
          </div>
          <Link
            href={`${basePath}/contact`}
            onClick={handleMobileNavClick}
            className="mt-4 block touch-manipulation"
          >
            <Button as="span" size="lg" className="w-full">{t("nav.contact")}</Button>
          </Link>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {!isDesktop ? (
        <header
          ref={mobileBarRef}
          className="site-header site-header-mobile site-header-bar site-chrome border-b border-line bg-bg"
        >
          <div className="container-site flex h-16 min-h-16 items-center justify-between">
            <Link
              href={basePath}
              className="relative z-[1] flex h-12 shrink-0 items-center"
              aria-label="D-GITALCODE"
            >
              <Logo size="md" priority />
            </Link>

            <button
              type="button"
              className="menu-toggle relative z-[2] flex h-11 min-h-11 w-11 min-w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/10 active:bg-white/15"
              onClick={toggleMenu}
              aria-label={mobileOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
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
      ) : (
        <header
          ref={desktopBarRef}
          className="site-header site-header-desktop site-header-bar site-chrome border-b border-line bg-bg/90 backdrop-blur-md"
        >
          <div className="container-site flex h-[4.5rem] min-h-[4.5rem] items-center justify-between gap-6">
            <Link href={basePath} className="flex shrink-0 items-center" aria-label="D-GITALCODE">
              <Logo size="md" priority />
            </Link>

            <nav
              aria-label={t("a11y.mainNavigation")}
              className="flex flex-1 items-center justify-center gap-1"
            >
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="group relative"
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setServicesOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      aria-controls="services-menu"
                      onClick={() => setServicesOpen((open) => !open)}
                      className="flex cursor-pointer items-center gap-1 rounded-control px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
                    >
                      {link.label}
                      <ChevronDown aria-hidden className="h-3.5 w-3.5 opacity-70" />
                    </button>
                    <div
                      id="services-menu"
                      className={cn(
                        "absolute start-0 top-full pt-2 transition-all motion-reduce:transition-none group-hover:visible group-hover:opacity-100",
                        servicesOpen ? "visible opacity-100" : "invisible opacity-0"
                      )}
                    >
                      <div className="min-w-[240px] rounded-panel border border-line bg-surface p-1.5 shadow-overlay">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-md px-3.5 py-2.5 text-sm text-ink-2 transition-colors hover:bg-white/[0.05] hover:text-ink"
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
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "rounded-control px-3 py-2 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-ink underline decoration-action decoration-2 underline-offset-[10px]"
                        : "text-ink-2 hover:text-ink"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center rounded-control border border-line p-0.5">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocale(l)}
                    hrefLang={l}
                    aria-label={localeNames[l]}
                    aria-current={l === locale ? "true" : undefined}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                      l === locale
                        ? "bg-white/[0.08] text-ink"
                        : "text-ink-3 hover:text-ink"
                    )}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>

              <Link href={`${basePath}/contact`}>
                <Button as="span" size="sm">{t("nav.contact")}</Button>
              </Link>
            </div>
          </div>
        </header>
      )}

      {mobileMenuPanel}
    </>
  );
}
