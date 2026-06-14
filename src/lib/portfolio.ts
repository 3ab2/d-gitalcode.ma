import { prisma } from "./prisma";
import { type Locale } from "./i18n/settings";
import {
  inferPortfolioCategory,
  type PortfolioCategory,
} from "./portfolio-category";

const projectInclude = (locale: Locale) => ({
  translations: { where: { locale } },
});

export type PortfolioProjectDetail = NonNullable<
  Awaited<ReturnType<typeof getPublishedProjectBySlug>>
>;

export type PortfolioTranslationFields = {
  locale: string;
  title: string;
  description: string;
  overview: string | null;
  challenge: string | null;
  solution: string | null;
  features: string[];
  results: string | null;
  outcome: string | null;
  client: string | null;
};

export async function getPublishedProjects(locale: Locale) {
  return prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: projectInclude(locale),
  });
}

export async function getPublishedProjectSlugs() {
  return prisma.portfolioProject.findMany({
    where: { published: true },
    select: { slug: true, translations: { select: { locale: true } } },
  });
}

export async function getPublishedProjectBySlug(slug: string, locale: Locale) {
  return prisma.portfolioProject.findUnique({
    where: { slug, published: true },
    include: projectInclude(locale),
  });
}

export async function getFeaturedProjects(locale: Locale, limit = 3) {
  return prisma.portfolioProject.findMany({
    where: { published: true, featured: true },
    orderBy: { order: "asc" },
    take: limit,
    include: projectInclude(locale),
  });
}

export function getProjectTranslation<
  T extends { translations: PortfolioTranslationFields[] },
>(project: T, locale: Locale): PortfolioTranslationFields | undefined {
  return (
    project.translations.find((t) => t.locale === locale) ??
    project.translations[0]
  );
}

export function getProjectCategory(
  technologies: string[]
): Exclude<PortfolioCategory, "all"> {
  return inferPortfolioCategory(technologies);
}

export function serializePortfolioListItem(
  project: Awaited<ReturnType<typeof getPublishedProjects>>[number],
  locale: Locale
) {
  const translation = getProjectTranslation(project, locale);
  return {
    id: project.id,
    slug: project.slug,
    title: translation?.title || project.slug,
    description: translation?.description || "",
    image: project.image,
    url: project.url,
    technologies: project.technologies,
    category: getProjectCategory(project.technologies),
    featured: project.featured,
  };
}
