import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale, isRtl, type Locale } from "@/lib/i18n/settings";
import { getMessages } from "@/lib/i18n/server";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { RootShell } from "@/components/layout/RootShell";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConversionFloat } from "@/components/layout/ConversionFloat";
import { getSocialLinks } from "@/lib/social-links";
import { getSiteSettings } from "@/lib/settings";
import { PublicSettingsProvider } from "@/components/providers/PublicSettingsProvider";
import { buildRootMetadata, rootViewport } from "@/lib/seo/root-metadata";

export const viewport = rootViewport;

export async function generateMetadata(): Promise<Metadata> {
  return buildRootMetadata();
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) notFound();

  const [messages, socialLinks, siteSettings] = await Promise.all([
    getMessages(locale as Locale),
    getSocialLinks(),
    getSiteSettings(),
  ]);
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <RootShell lang={locale} dir={dir}>
      <div className="flex min-h-[100dvh] flex-col">
        <I18nProvider locale={locale as Locale} messages={messages}>
          <PublicSettingsProvider settings={siteSettings}>
            <SkipLink />
            <Header locale={locale as Locale} />
            <main
              id="main-content"
              tabIndex={-1}
              className="main-with-header relative z-0 flex-1 w-full overflow-x-clip focus:outline-none"
            >
              {children}
            </main>
            <Footer
              locale={locale as Locale}
              socialLinks={socialLinks}
              contactEmail={siteSettings.contactEmail}
              phone={siteSettings.phone}
              address={siteSettings.address}
              productDemoUrl={siteSettings.productDemoUrl}
            />
            <ConversionFloat locale={locale as Locale} />
          </PublicSettingsProvider>
        </I18nProvider>
      </div>
    </RootShell>
  );
}
