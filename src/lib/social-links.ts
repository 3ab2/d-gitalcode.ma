import { prisma } from "./prisma";
import {
  DEFAULT_SOCIAL_LINKS,
  SOCIAL_PLATFORMS,
  type SocialLinkConfig,
  type SocialPlatform,
} from "@/config/social-links";

export type SocialLinkItem = SocialLinkConfig & { id?: string };

function isValidPlatform(platform: string): platform is SocialPlatform {
  return SOCIAL_PLATFORMS.includes(platform as SocialPlatform);
}

function mergeWithDefaults(
  dbLinks: { platform: string; url: string; label: string; enabled: boolean; id: string }[]
): SocialLinkItem[] {
  const dbMap = new Map(dbLinks.map((l) => [l.platform, l]));

  return DEFAULT_SOCIAL_LINKS.map((defaultLink) => {
    const dbLink = dbMap.get(defaultLink.platform);
    if (dbLink) {
      return {
        id: dbLink.id,
        platform: defaultLink.platform,
        url: dbLink.url,
        label: dbLink.label,
        enabled: dbLink.enabled,
      };
    }
    return defaultLink;
  });
}

export async function getSocialLinks(): Promise<SocialLinkItem[]> {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    });
    return mergeWithDefaults(links).filter((l) => l.enabled !== false);
  } catch {
    return DEFAULT_SOCIAL_LINKS.filter((l) => l.enabled !== false);
  }
}

export async function getAllSocialLinksAdmin(): Promise<SocialLinkItem[]> {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    });
    return mergeWithDefaults(links);
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export async function upsertSocialLinks(
  items: { platform: string; url: string; label: string; enabled: boolean }[]
) {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!isValidPlatform(item.platform)) continue;

    const result = await prisma.socialLink.upsert({
      where: { platform: item.platform },
      create: {
        platform: item.platform,
        url: item.url,
        label: item.label,
        enabled: item.enabled,
        order: i,
      },
      update: {
        url: item.url,
        label: item.label,
        enabled: item.enabled,
        order: i,
      },
    });
    results.push(result);
  }

  return results;
}
