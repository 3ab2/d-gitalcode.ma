"use client";

import { useTranslation } from "react-i18next";
import { DEFAULT_SOCIAL_LINKS, type SocialLinkConfig, type SocialPlatform } from "@/config/social-links";
import { GitHubIcon } from "./GitHubIcon";
import { InstagramIcon } from "./InstagramIcon";
import { KofiIcon } from "./KofiIcon";
import { LinkedInIcon } from "./LinkedInIcon";
import { cn } from "@/lib/utils";

const platformStyles: Record<
  SocialPlatform,
  { icon: string; hover: string; ring: string }
> = {
  instagram: {
    icon: "text-white/70 group-hover:text-white",
    hover:
      "hover:border-pink-500/40 hover:bg-gradient-to-br hover:from-purple-600/20 hover:via-pink-500/20 hover:to-orange-400/20",
    ring: "group-hover:shadow-pink-500/20",
  },
  linkedin: {
    icon: "text-white/70 group-hover:text-[#0A66C2]",
    hover: "hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10",
    ring: "group-hover:shadow-[#0A66C2]/20",
  },
  github: {
    icon: "text-white/70 group-hover:text-white",
    hover: "hover:border-white/30 hover:bg-white/10",
    ring: "group-hover:shadow-white/10",
  },
  kofi: {
    icon: "text-white/70 group-hover:text-[#FF5E5B]",
    hover: "hover:border-[#FF5E5B]/40 hover:bg-[#FF5E5B]/10",
    ring: "group-hover:shadow-[#FF5E5B]/20",
  },
};

function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const props = { className: cn("h-5 w-5", className) };
  switch (platform) {
    case "instagram":
      return <InstagramIcon {...props} />;
    case "linkedin":
      return <LinkedInIcon {...props} />;
    case "github":
      return <GitHubIcon {...props} />;
    case "kofi":
      return <KofiIcon {...props} />;
  }
}

interface SocialLinksProps {
  links?: SocialLinkConfig[];
  variant?: "icons" | "buttons";
  className?: string;
}

export function SocialLinks({ links = DEFAULT_SOCIAL_LINKS, variant = "icons", className }: SocialLinksProps) {
  const { t } = useTranslation();
  const activeLinks = links.filter((l) => l.enabled !== false);

  if (variant === "buttons") {
    return (
      <div className={cn("grid grid-cols-2 gap-4", className)}>
        {activeLinks.map((link) => {
          const styles = platformStyles[link.platform];
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={t(`social.${link.platform}`)}
              className={cn(
                "group relative flex touch-manipulation items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 transition-all duration-300 active:scale-[0.98]",
                styles.hover,
                styles.ring,
                "hover:shadow-lg"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-colors",
                  styles.icon
                )}
              >
                <SocialIcon platform={link.platform} />
              </div>
              <span className="text-sm font-medium text-white/80 group-hover:text-white">
                {t(`social.${link.platform}`)}
              </span>
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-brand-card border border-white/10 px-2 py-1 text-xs text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                {t(`social.${link.platform}`)}
              </span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {activeLinks.map((link) => {
        const styles = platformStyles[link.platform];
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={t(`social.${link.platform}`)}
            aria-label={t(`social.${link.platform}`)}
            className={cn(
              "group flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 active:scale-95",
              styles.hover,
              styles.icon
            )}
          >
            <SocialIcon platform={link.platform} />
          </a>
        );
      })}
    </div>
  );
}
