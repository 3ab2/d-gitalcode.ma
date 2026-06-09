"use client";

import { SafeMotionDiv } from "@/components/ui/SafeMotion";
import { useTranslation } from "react-i18next";
import { type SocialLinkConfig } from "@/config/social-links";
import { SocialLinks } from "./SocialLinks";

export function SocialConnect({ links }: { links: SocialLinkConfig[] }) {
  const { t } = useTranslation();

  return (
    <SafeMotionDiv
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8"
    >
      <h3 className="text-xl font-semibold text-white">
        {t("contact.connectTitle")}
      </h3>
      <p className="mt-2 text-sm text-white/50">{t("contact.connectDesc")}</p>
      <SocialLinks links={links} variant="buttons" className="mt-6" />
    </SafeMotionDiv>
  );
}
