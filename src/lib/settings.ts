import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";
import {
  DEFAULT_SITE_SETTINGS,
  SETTING_KEYS,
  type SiteSettings,
} from "@/lib/site-settings";

export const SITE_SETTINGS_CACHE_TAG = "site-settings";

export type { SiteSettings };
export { SETTING_KEYS, DEFAULT_SITE_SETTINGS };

function mapRows(rows: { key: string; value: string }[]): SiteSettings {
  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    contactEmail:
      map.get(SETTING_KEYS.CONTACT_EMAIL) ?? DEFAULT_SITE_SETTINGS.contactEmail,
    whatsappNumber:
      map.get(SETTING_KEYS.WHATSAPP_NUMBER) ??
      DEFAULT_SITE_SETTINGS.whatsappNumber,
    phone: map.get(SETTING_KEYS.PHONE) ?? DEFAULT_SITE_SETTINGS.phone,
    address: map.get(SETTING_KEYS.ADDRESS) ?? DEFAULT_SITE_SETTINGS.address,
    seoTitle:
      map.get(SETTING_KEYS.SEO_TITLE) ?? DEFAULT_SITE_SETTINGS.seoTitle,
    seoDescription:
      map.get(SETTING_KEYS.SEO_DESCRIPTION) ??
      DEFAULT_SITE_SETTINGS.seoDescription,
    seoKeywords:
      map.get(SETTING_KEYS.SEO_KEYWORDS) ?? DEFAULT_SITE_SETTINGS.seoKeywords,
  };
}

async function loadSiteSettingsFromDb(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    if (rows.length === 0) return DEFAULT_SITE_SETTINGS;
    return mapRows(rows);
  } catch (error) {
    logError("settings", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export const getSiteSettings = unstable_cache(
  loadSiteSettingsFromDb,
  ["site-settings"],
  { revalidate: 60, tags: [SITE_SETTINGS_CACHE_TAG] }
);

export async function upsertSiteSettings(
  values: Partial<SiteSettings>
): Promise<SiteSettings> {
  const entries: [string, string][] = [];

  if (values.contactEmail !== undefined) {
    entries.push([SETTING_KEYS.CONTACT_EMAIL, values.contactEmail]);
  }
  if (values.whatsappNumber !== undefined) {
    entries.push([SETTING_KEYS.WHATSAPP_NUMBER, values.whatsappNumber]);
  }
  if (values.phone !== undefined) {
    entries.push([SETTING_KEYS.PHONE, values.phone]);
  }
  if (values.address !== undefined) {
    entries.push([SETTING_KEYS.ADDRESS, values.address]);
  }
  if (values.seoTitle !== undefined) {
    entries.push([SETTING_KEYS.SEO_TITLE, values.seoTitle]);
  }
  if (values.seoDescription !== undefined) {
    entries.push([SETTING_KEYS.SEO_DESCRIPTION, values.seoDescription]);
  }
  if (values.seoKeywords !== undefined) {
    entries.push([SETTING_KEYS.SEO_KEYWORDS, values.seoKeywords]);
  }

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  revalidateTag(SITE_SETTINGS_CACHE_TAG, { expire: 0 });
  return loadSiteSettingsFromDb();
}
