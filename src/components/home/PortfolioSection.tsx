"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { type PortfolioCategory } from "@/lib/portfolio-category";
import { type Locale } from "@/lib/i18n/settings";

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  url: string | null;
  technologies: string[];
  category: Exclude<PortfolioCategory, "all">;
}

const filters: PortfolioCategory[] = ["all", "websites", "mobile", "wordpress", "other"];

export function PortfolioSection({
  locale,
  projects,
}: {
  locale: Locale;
  projects: PortfolioItem[];
}) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [projects, activeFilter]
  );

  if (projects.length === 0) return null;

  return (
    <section id="portfolio" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("home.portfolio.title")}
          subtitle={t("home.portfolio.subtitle")}
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "min-h-11 cursor-pointer touch-manipulation rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "border-brand-green/40 bg-brand-green/15 text-brand-green"
                  : "border-white/10 text-white/60 hover:border-white/20 hover:text-white"
              )}
            >
              {t(`home.portfolio.filters.${filter}`)}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <GlassCard key={project.id} className="group overflow-hidden p-0">
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-card">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-green/10 to-brand-purple/10 text-white/60">
                    D-GITALCODE
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="mb-2">
                    {t(`home.portfolio.filters.${project.category}`)}
                  </Badge>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="line-clamp-2 text-sm text-white/55">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 touch-manipulation items-center gap-2 text-sm font-medium text-brand-green hover:underline"
                    >
                      {t("portfolio.viewProject")}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`${basePath}/portfolio/${project.slug}`}
                    className="inline-flex min-h-11 items-center text-sm text-white/50 hover:text-white"
                  >
                    {t("home.portfolio.details")} →
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`${basePath}/portfolio`}
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-green hover:underline"
          >
            {t("home.portfolio.viewAll")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
