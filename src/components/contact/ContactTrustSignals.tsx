"use client";

import { Clock, Shield, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ContactTrustSignals() {
  const { t } = useTranslation();

  const items = [
    {
      icon: Clock,
      title: t("contact.trust.responseTime"),
      desc: t("contact.trust.responseTimeDesc"),
    },
    {
      icon: Sparkles,
      title: t("contact.trust.expertise"),
      desc: t("contact.trust.expertiseDesc"),
    },
    {
      icon: Shield,
      title: t("contact.trust.confidential"),
      desc: t("contact.trust.confidentialDesc"),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="mt-1 text-xs text-white/50">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
