import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { getHomepageServiceCategories } from "@/lib/services";
import { getSocialLinks } from "@/lib/social-links";
import { inferPortfolioCategory, estimateReadTime } from "@/lib/portfolio-category";
import { Hero } from "@/components/home/Hero";
import { AgencyMapSection } from "@/components/home/agency-map/AgencyMapSection";
import { TrustSection } from "@/components/home/TrustSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { HomeContactSection } from "@/components/home/HomeContactSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const { t } = await getTranslation(loc);
  return buildPublicPageMetadata({
    locale: loc,
    path: "",
    title: `${t("hero.brand")} — ${t("hero.badge")}`,
    description: t("hero.subtitle"),
  });
}

const defaultStats = [
  { key: "projects", value: "50+", label: "" },
  { key: "clients", value: "30+", label: "" },
  { key: "technologies", value: "20+", label: "" },
  { key: "support", value: "24/7", label: "" },
];

async function getHomeData(locale: Locale) {
  try {
    const [stats, services, projects, posts, socialLinks] = await Promise.all([
      prisma.siteStat.findMany(),
      getHomepageServiceCategories(locale),
      prisma.portfolioProject.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 9,
        include: { translations: { where: { locale } } },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: 4,
        include: {
          translations: { where: { locale } },
          categories: {
            include: {
              category: { include: { translations: { where: { locale } } } },
            },
          },
        },
      }),
      getSocialLinks(),
    ]);

    return {
      stats: stats.length > 0 ? stats : defaultStats,
      services,
      projects: projects.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.translations[0]?.title || p.slug,
        description: p.translations[0]?.description || "",
        image: p.image,
        url: p.url,
        technologies: p.technologies,
        category: inferPortfolioCategory(p.technologies),
      })),
      posts: posts.map((p) => {
        const translation = p.translations[0];
        return {
          id: p.id,
          slug: p.slug,
          title: translation?.title || p.slug,
          excerpt: translation?.excerpt || null,
          image: p.image,
          publishedAt: p.publishedAt,
          readTime: estimateReadTime(translation?.content || ""),
          categories: p.categories
            .map((c) => c.category.translations[0]?.name)
            .filter(Boolean) as string[],
          featured: p.featured,
        };
      }),
      socialLinks,
    };
  } catch {
    return {
      stats: defaultStats,
      services: await getHomepageServiceCategories(locale).catch(() => []),
      projects: [],
      posts: [],
      socialLinks: await getSocialLinks().catch(() => []),
    };
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getHomeData(locale as Locale);

  return (
    <>
      <SiteJsonLd locale={locale as Locale} />
      <Hero locale={locale as Locale} stats={data.stats} />
      <AgencyMapSection locale={locale as Locale} />
      <TrustSection locale={locale as Locale} />
      <ServicesSection locale={locale as Locale} services={data.services} />
      <PortfolioSection locale={locale as Locale} projects={data.projects} />
      <BlogPreviewSection locale={locale as Locale} posts={data.posts} />
      <AboutPreviewSection locale={locale as Locale} />
      <HomeContactSection locale={locale as Locale} socialLinks={data.socialLinks} />
    </>
  );
}
