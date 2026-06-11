import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/social/GitHubIcon";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";

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
    path: "portfolio",
    title: `${t("portfolio.title")} | D-GITALCODE`,
    description: t("portfolio.subtitle"),
  });
}

async function getProjects(locale: Locale) {
  try {
    return await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale } } },
    });
  } catch {
    return [];
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale as Locale);
  const projects = await getProjects(locale as Locale);

  return (
    <section className="pt-10 pb-16 md:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("portfolio.title")}
          subtitle={t("portfolio.subtitle")}
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const translation = project.translations[0];
            return (
              <Card key={project.id} className="overflow-hidden p-0">
                {project.image && (
                  <div className="relative h-48">
                    <Image
                      src={project.image}
                      alt={translation?.title || project.slug}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">
                    {translation?.title || project.slug}
                  </h3>
                  {translation?.client && (
                    <p className="text-sm text-white/40 mt-1">
                      {translation.client}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-white/50 line-clamp-3">
                    {translation?.description}
                  </p>
                  {project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-brand-green hover:underline"
                      >
                        {t("portfolio.viewProject")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
                      >
                        GitHub
                        <GitHubIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-white/50 mt-16">
            {t("portfolio.subtitle")}
          </p>
        )}
      </div>
    </section>
  );
}
