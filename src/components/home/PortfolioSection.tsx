"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FacetFrame } from "@/components/ui/FacetFrame";
import { buttonClasses } from "@/components/ui/Button";
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

/** One project: image, title, summary, stack. The whole card opens the case page. */
export function ProjectCard({
  project,
  basePath,
}: {
  project: Pick<PortfolioItem, "slug" | "title" | "description" | "image"> & { technologies?: string[] };
  basePath: string;
}) {
  return (
    <Link href={`${basePath}/portfolio/${project.slug}`} className="group block">
      <FacetFrame size="md" className="transition-colors duration-200 group-hover:bg-white/30">
        <div className="relative aspect-[16/10]">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-ink-3">{project.title}</div>
          )}
        </div>
      </FacetFrame>
      <h3 className="mt-5 text-lg font-medium text-ink group-hover:underline group-hover:underline-offset-4">
        {project.title}
      </h3>
      {project.description && <p className="mt-2 line-clamp-2 max-w-xl text-ink-2">{project.description}</p>}
      {project.technologies && project.technologies.length > 0 && (
        <p className="mt-3 font-mono text-xs text-ink-3">{project.technologies.slice(0, 4).join("  /  ")}</p>
      )}
    </Link>
  );
}

export function PortfolioSection({
  locale,
  projects,
  skipFirst = false,
}: {
  locale: Locale;
  projects: PortfolioItem[];
  /** The hero already shows the first project. */
  skipFirst?: boolean;
}) {
  const { t } = useTranslation();
  const basePath = `/${locale}`;
  const shown = skipFirst && projects.length > 2 ? projects.slice(1, 5) : projects.slice(0, 4);

  if (shown.length === 0) return null;

  return (
    <section id="portfolio" className="section-y border-t border-line">
      <div className="container-site">
        <SectionHeading title={t("home.portfolio.title")} subtitle={t("home.portfolio.subtitle")} />

        <ul className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:mt-20">
          {shown.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} basePath={basePath} />
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <Link href={`${basePath}/portfolio`} className={buttonClasses("outline", "md")}>
            {t("home.portfolio.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
