"use client";

import { useTranslation } from "react-i18next";
import { DEFAULT_SOCIAL_LINKS, type SocialLinkConfig, type SocialPlatform } from "@/config/social-links";
import { GitHubIcon } from "./GitHubIcon";
import { InstagramIcon } from "./InstagramIcon";
import { KofiIcon } from "./KofiIcon";
import { LinkedInIcon } from "./LinkedInIcon";
import { YouTubeIcon } from "./YouTubeIcon";
import { cn } from "@/lib/utils";

function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const props = { className: cn("h-[1.125rem] w-[1.125rem]", className) };
  switch (platform) {
    case "instagram":
      return <InstagramIcon {...props} />;
    case "linkedin":
      return <LinkedInIcon {...props} />;
    case "github":
      return <GitHubIcon {...props} />;
    case "youtube":
      return <YouTubeIcon {...props} />;
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
      <ul className={cn("grid grid-cols-2 gap-2", className)}>
        {activeLinks.map((link) => (
          <li key={link.platform}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 touch-manipulation items-center gap-3 rounded-control border border-line px-3.5 py-2.5 text-sm text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              <SocialIcon platform={link.platform} />
              {t(`social.${link.platform}`)}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeLinks.map((link) => (
        <li key={link.platform}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={t(`social.${link.platform}`)}
            aria-label={t(`social.${link.platform}`)}
            className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-control border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            <SocialIcon platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
