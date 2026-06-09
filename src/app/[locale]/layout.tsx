import { notFound } from "next/navigation";
import { isValidLocale, isRtl, type Locale } from "@/lib/i18n/settings";
import { getMessages } from "@/lib/i18n/server";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { getSocialLinks } from "@/lib/social-links";

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

  const [messages, socialLinks] = await Promise.all([
    getMessages(locale as Locale),
    getSocialLinks(),
  ]);
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={dir} className="flex min-h-[100dvh] flex-col">
      <I18nProvider locale={locale as Locale} messages={messages}>
        <Header locale={locale as Locale} />
        <main className="main-with-header relative z-0 flex-1 w-full overflow-x-clip">{children}</main>
        <Footer locale={locale as Locale} socialLinks={socialLinks} />
        <WhatsAppFloat locale={locale as Locale} />
      </I18nProvider>
    </div>
  );
}
