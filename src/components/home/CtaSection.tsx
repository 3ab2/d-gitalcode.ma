"use client";

import Link from "next/link";
import { SafeMotionDiv } from "@/components/ui/SafeMotion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { buildGeneralContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { type Locale } from "@/lib/i18n/settings";

export function CtaSection({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;
  const whatsappUrl = buildWhatsAppUrl(buildGeneralContactMessage(locale));

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 via-brand-purple/5 to-brand-green/10" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <SafeMotionDiv
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {t("cta.title")}
          </h2>
          <p className="mt-4 text-lg text-white/60">{t("cta.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={`${basePath}/contact`}>
              <Button size="lg">{t("cta.button")}</Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg">
                {t("cta.whatsapp")}
              </Button>
            </a>
          </div>
        </SafeMotionDiv>
      </div>
    </section>
  );
}
