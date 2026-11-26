export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "github"
  | "youtube"
  | "kofi";

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
  "youtube",
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
    url: "https://www.linkedin.com/in/dgitalcode-org-0604583bb/",
    label: "LinkedIn",
    enabled: true,
  },
  {
    platform: "github",
    url: "https://github.com/dgitalcode",
    label: "GitHub",
    enabled: true,
  },
  {
    platform: "youtube",
    url: "https://www.youtube.com/@d-gitalcode",
    label: "YouTube",
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

/** Old addresses that may still be stored in the database. */
const RETIRED_URLS = new Set([
  "https://www.linkedin.com/in/d-gitalcode-elkarch-abdelhamid-0604583bb",
]);

/** The stored address, or the current default when the stored one is retired. */
export function currentSocialUrl(platform: SocialPlatform, stored: string): string {
  return RETIRED_URLS.has(stored.replace(/\/+$/, ""))
    ? defaultSocialLinkMap[platform].url
    : stored;
}
