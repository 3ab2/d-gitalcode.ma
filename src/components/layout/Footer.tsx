"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { useTranslation } from "react-i18next";
import { type Locale } from "@/lib/i18n/settings";
import { SocialLinks } from "@/components/social/SocialLinks";
import { CONTACT_EMAIL } from "@/config/contact";
import { type SocialLinkConfig } from "@/config/social-links";

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
  const basePath = `/${locale}`;
  const year = new Date().getFullYear();

  const serviceLinks = [
    { href: `${basePath}/services/web-development`, label: t("nav.webDev") },
    { href: `${basePath}/services/mobile-apps`, label: t("nav.mobileApps") },
    { href: `${basePath}/services/wordpress-plugins`, label: t("nav.wpPlugins") },
    { href: `${basePath}/services/wordpress-templates`, label: t("nav.wpTemplates") },
  ];

  const quickLinks = [
    { href: basePath, label: t("nav.home") },
    { href: `${basePath}/services`, label: t("nav.allServices") },
    { href: `${basePath}/about`, label: t("nav.about") },
    { href: `${basePath}/portfolio`, label: t("nav.portfolio") },
    { href: `${basePath}/blog`, label: t("nav.blog") },
    { href: `${basePath}/contact`, label: t("nav.contact") },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-brand-dark">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href={basePath} className="inline-block">
              <Logo size="lg" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              {t("footer.description")}
            </p>
            <div className="mt-6">
              <SocialLinks links={socialLinks} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-brand-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.services")}
            </h3>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-brand-green"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.contact")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/50">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="transition-colors hover:text-brand-green"
                >
                  {contactEmail}
                </a>
              </li>
              {phone && <li>{phone}</li>}
              {address && <li>{address}</li>}
              <li>
                <Link href={`${basePath}/contact`} className="transition-colors hover:text-brand-green">
                  {t("nav.contact")}
                </Link>
              </li>
              {productDemoUrl ? (
                <li>
                  <a
                    href={productDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-brand-green"
                  >
                    {t("footer.demo")}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-white/[0.06] pt-8 text-center text-sm text-white/40 sm:flex-row sm:justify-between">
          <p>© {year} D-GITALCODE. {t("footer.rights")}</p>
          <Link
            href={`${basePath}/privacy-policy`}
            className="transition-colors hover:text-brand-green"
          >
            {t("footer.privacyPolicy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
