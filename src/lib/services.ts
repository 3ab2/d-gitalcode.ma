import { prisma } from "./prisma";
import { type Locale } from "./i18n/settings";
import type { ServiceType } from "@prisma/client";

export const SERVICE_CATEGORY_SLUGS: Record<ServiceType, string> = {
  WEB_DEVELOPMENT: "web-development",
  MOBILE_APPS: "mobile-apps",
  WORDPRESS_PLUGINS: "wordpress-plugins",
  WORDPRESS_TEMPLATES: "wordpress-templates",
};

export const HOME_SERVICE_TYPES: ServiceType[] = [
  "WEB_DEVELOPMENT",
  "MOBILE_APPS",
  "WORDPRESS_PLUGINS",
  "WORDPRESS_TEMPLATES",
];

const slugToType: Record<string, ServiceType> = {
  "web-development": "WEB_DEVELOPMENT",
  "mobile-apps": "MOBILE_APPS",
  "wordpress-plugins": "WORDPRESS_PLUGINS",
  "wordpress-templates": "WORDPRESS_TEMPLATES",
};

export function getServiceTypeFromSlug(slug: string): ServiceType | null {
  return slugToType[slug] || null;
}

export async function getServicesByType(type: ServiceType, locale: Locale) {
  try {
    return await prisma.service.findMany({
      where: { type, published: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale } },
      },
    });
  } catch {
    return [];
  }
}

export async function getAllServices(locale: Locale) {
  try {
    return await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        translations: { where: { locale } },
      },
    });
  } catch {
    return [];
  }
}

/** Lowest-priced published service per category — same source as service pages */
export async function getHomepageServiceCategories(locale: Locale) {
  try {
    const services = await prisma.service.findMany({
      where: { published: true, type: { in: HOME_SERVICE_TYPES } },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale } } },
    });

    return HOME_SERVICE_TYPES.map((type) => {
      const ofType = services.filter((s) => s.type === type);
      const cheapest = ofType.reduce<(typeof ofType)[0] | null>((best, current) => {
        if (current.price == null) return best ?? current;
        if (best?.price == null) return current;
        return current.price < best.price ? current : best;
      }, null);

      return {
        type,
        slug: SERVICE_CATEGORY_SLUGS[type],
        price: cheapest?.price ?? null,
        priceLabel: cheapest?.priceLabel ?? null,
        features: cheapest?.translations[0]?.features ?? [],
      };
    });
  } catch {
    return HOME_SERVICE_TYPES.map((type) => ({
      type,
      slug: SERVICE_CATEGORY_SLUGS[type],
      price: null,
      priceLabel: null,
      features: [] as string[],
    }));
  }
}

export function mapService(
  service: Awaited<ReturnType<typeof getServicesByType>>[0],
  locale: Locale
) {
  const translation = service.translations[0];
  return {
    id: service.id,
    slug: service.slug,
    title: translation?.title || service.slug,
    shortDesc: translation?.shortDesc || null,
    description: translation?.description || "",
    price: service.price,
    priceLabel: service.priceLabel,
    image: service.image,
    demoUrl: service.demoUrl,
    features: translation?.features || [],
    featured: service.featured,
  };
}
