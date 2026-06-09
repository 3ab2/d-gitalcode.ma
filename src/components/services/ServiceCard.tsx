"use client";

import { useState } from "react";
import Image from "next/image";
import { SafeMotionDiv } from "@/components/ui/SafeMotion";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RequestServiceModal } from "./RequestServiceModal";
import { formatPrice } from "@/lib/utils";
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
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SafeMotionDiv
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
      >
        <Card className="h-full flex flex-col">
          {service.image && (
            <div className="relative h-48 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              {service.featured && <Badge variant="green">Featured</Badge>}
            </div>

            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              {service.shortDesc || service.description.slice(0, 150)}
            </p>

            {service.features.length > 0 && (
              <ul className="mt-4 space-y-2">
                {service.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            {(service.price || service.priceLabel) && (
              <div className="mb-4">
                <span className="text-sm text-white/50">{t("request.price")}: </span>
                <span className="text-lg font-bold text-brand-green">
                  {service.priceLabel ||
                    (service.price ? formatPrice(service.price) : "")}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => setModalOpen(true)}
              >
                {t("services.request")}
              </Button>
              {service.demoUrl && (
                <a href={service.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="md">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </Card>
      </SafeMotionDiv>

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
