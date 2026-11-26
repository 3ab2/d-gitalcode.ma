"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button, buttonClasses } from "@/components/ui/Button";
import { RequestServiceModal } from "./RequestServiceModal";
import { useCurrency } from "@/components/providers/PublicSettingsProvider";
import { type Locale } from "@/lib/i18n/settings";

interface ServiceCardProps {
  locale: Locale;
  service: {
    id: string;
    slug: string;
    title: string;
    shortDesc: string | null;
    description: string;
    price: number | null;
    priceLabel: string | null;
    image: string | null;
    demoUrl: string | null;
    features: string[];
    featured: boolean;
  };
}

export function ServiceCard({ locale, service }: ServiceCardProps) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const [modalOpen, setModalOpen] = useState(false);
  const price = service.priceLabel || (service.price ? formatPrice(service.price, locale) : "");

  return (
    <>
      <article className="flex h-full flex-col overflow-hidden rounded-panel border border-line bg-surface">
        {service.image && (
          <div className="relative aspect-[16/9] border-b border-line">
            <Image src={service.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-medium text-ink">{service.title}</h3>
          <p className="mt-3 text-ink-2">{service.shortDesc || service.description.slice(0, 150)}</p>

          {service.features.length > 0 && (
            <ul className="mt-5 space-y-2 text-sm text-ink-2">
              {service.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-baseline gap-2.5">
                  <span aria-hidden className="facet h-1.5 w-1.5 shrink-0 translate-y-[-1px] bg-action [--facet:2px]" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-6">
            {price && (
              <p className="mb-5 border-t border-line pt-5 text-sm text-ink-3">
                {t("request.price")} <span className="ms-1 text-lg font-medium text-ink">{price}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button className="flex-1" onClick={() => setModalOpen(true)}>
                {t("services.request")}
              </Button>
              {service.demoUrl && (
                <a href={service.demoUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline", "md")}>
                  {t("request.demo")}
                </a>
              )}
            </div>
          </div>
        </div>
      </article>

      <RequestServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        locale={locale}
        serviceId={service.id}
        serviceName={service.title}
      />
    </>
  );
}
