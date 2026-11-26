"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceGrid, type ServiceGridItem } from "@/components/services/ServiceGrid";
import { type Locale } from "@/lib/i18n/settings";

export function ServicesSection({ locale, services }: { locale: Locale; services: ServiceGridItem[] }) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;

  return (
    <section id="services" className="section-y">
      <div className="container-site">
        <SectionHeading title={t("home.services.title")} subtitle={t("home.services.subtitle")} />
        <ServiceGrid locale={locale} services={services} className="mt-14 lg:mt-20" />
        <div className="mt-12">
          <Link href={`${basePath}/services`} className={buttonClasses("outline", "md")}>
            {t("nav.allServices")}
          </Link>
        </div>
      </div>
    </section>
  );
}
