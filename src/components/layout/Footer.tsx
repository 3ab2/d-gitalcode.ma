"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/Logo";
import { type Locale, localeNames, locales } from "@/lib/i18n/settings";
import { SocialLinks } from "@/components/social/SocialLinks";
import { CONTACT_EMAIL } from "@/config/contact";
import { type SocialLinkConfig } from "@/config/social-links";

const linkClass = "text-sm text-ink-2 transition-colors hover:text-ink";

export function Footer({
  locale,
  socialLinks,
  contactEmail = CONTACT_EMAIL,
  phone,
  address,
  productDemoUrl,
}: {
  locale: Locale;
  socialLinks: SocialLinkConfig[];
  contactEmail?: string;
  phone?: string;
  address?: string;
  productDemoUrl?: string;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const basePath = `/${locale}`;
  const year = new Date().getFullYear();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  const columns = [
    {
      title: t("footer.services"),
      links: [
        { href: `${basePath}/services/web-development`, label: t("nav.webDev") },
        { href: `${basePath}/services/mobile-apps`, label: t("nav.mobileApps") },
        { href: `${basePath}/services/wordpress-plugins`, label: t("nav.wpPlugins") },
        { href: `${basePath}/services/wordpress-templates`, label: t("nav.wpTemplates") },
        { href: `${basePath}/services`, label: t("nav.allServices") },
      ],
    },
    {
      title: t("footer.quickLinks"),
      links: [
        { href: `${basePath}/portfolio`, label: t("nav.portfolio") },
        { href: `${basePath}/about`, label: t("nav.about") },
        { href: `${basePath}/blog`, label: t("nav.blog") },
        { href: `${basePath}/contact`, label: t("nav.contact") },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-site pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href={basePath} className="inline-flex" aria-label="D-GITALCODE">
              <Logo size="lg" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-2">{t("footer.description")}</p>
            <SocialLinks links={socialLinks} className="mt-6" />
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
              <h2 className="text-sm font-medium text-ink">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <h2 className="text-sm font-medium text-ink">{t("footer.contact")}</h2>
            <ul className="mt-5 space-y-3 text-sm text-ink-2">
              <li>
                <a href={`mailto:${contactEmail}`} className={linkClass}>
                  {contactEmail}
                </a>
              </li>
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={linkClass} dir="ltr">
                    {phone}
                  </a>
                </li>
              )}
              {address && <li>{address}</li>}
              {productDemoUrl ? (
                <li>
                  <a href={productDemoUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {t("footer.demo")}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-line pt-8 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} D-GITALCODE. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={`${basePath}/privacy-policy`} className="transition-colors hover:text-ink">
              {t("footer.privacyPolicy")}
            </Link>
            <ul className="flex items-center gap-4" aria-label={t("a11y.language")}>
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={switchLocale(l)}
                    hrefLang={l}
                    lang={l}
                    aria-current={l === locale ? "true" : undefined}
                    className={l === locale ? "text-ink" : "transition-colors hover:text-ink"}
                  >
                    {localeNames[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
