"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function ContactTrustSignals({ className }: { className?: string }) {
  const { t } = useTranslation();

  const items = [
    { title: t("contact.trust.responseTime"), desc: t("contact.trust.responseTimeDesc") },
    { title: t("contact.trust.expertise"), desc: t("contact.trust.expertiseDesc") },
    { title: t("contact.trust.confidential"), desc: t("contact.trust.confidentialDesc") },
  ];

  return (
    <dl className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <div key={item.title} className="py-5">
          <dt className="flex items-center gap-2.5 font-medium text-ink">
            <span aria-hidden className="facet h-2 w-2 bg-action [--facet:3px]" />
            {item.title}
          </dt>
          <dd className="mt-1.5 ps-[1.125rem] text-sm text-ink-2">{item.desc}</dd>
        </div>
      ))}
    </dl>
  );
}
