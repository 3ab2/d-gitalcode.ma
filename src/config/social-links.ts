export type SocialPlatform = "instagram" | "linkedin" | "github" | "kofi";

export interface SocialLinkConfig {
  platform: SocialPlatform;
  url: string;
  label: string;
  enabled?: boolean;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "instagram",
  "linkedin",
  "github",
  "kofi",
];

export const DEFAULT_SOCIAL_LINKS: SocialLinkConfig[] = [
  {
    platform: "instagram",
    url: "https://www.instagram.com/digitalcode.ma/",
    label: "Instagram",
    enabled: true,
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/d-gitalcode-elkarch-abdelhamid-0604583bb/",
    label: "LinkedIn",
    enabled: true,
  },
  {
    platform: "github",
    url: "https://github.com/3ab2",
    label: "GitHub",
    enabled: true,
  },
  {
    platform: "kofi",
    url: "https://ko-fi.com/d_igitalcode",
    label: "Ko-fi",
    enabled: true,
  },
];

export const defaultSocialLinkMap = Object.fromEntries(
  DEFAULT_SOCIAL_LINKS.map((link) => [link.platform, link])
) as Record<SocialPlatform, SocialLinkConfig>;
