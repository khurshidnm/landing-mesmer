"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "@/components/BluredImage";
import { useLocale, useTranslations } from "next-intl";
import { t as cmsText } from "@/lib/cms/definitions";
import type { FinancierEntry, HomeContent } from "@/lib/cms/content-types";
import ProjectCard, { type ProjectCardData } from "@/components/project-card";
import SectionHeading from "./SectionHeading";

// Home page projects block: intro texts from Website Content → Home Page Texts
// and the latest projects from the project database.
const ProjectsSection = ({
  content,
  projects = [],
  financiers = [],
}: {
  content?: HomeContent;
  projects?: ProjectCardData[];
  financiers?: FinancierEntry[];
}) => {
  const tr = useTranslations("home.projects");
  const locale = useLocale() as "en" | "ru" | "uz";
  const t = (key: string) => {
    const field = { title: "projects_title", sub_title: "projects_subtitle", description: "projects_description", button: "projects_button" }[key];
    return (field && cmsText(content?.[field as keyof HomeContent] as Record<string, string>, locale)) || tr(key);
  };
  const financierName = (slug?: string) => financiers.find((f) => f.slug === slug)?.name || "";

  const button = (
    <Link
      href={`/${locale}/projects`}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
    >
      {t("button")}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading size="md" eyebrow={t("title")} title={t("sub_title")} description={t("description")} action={button} />

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} locale={locale} financierName={financierName(project.financier)} />
          ))}
        </div>
      ) : (
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg">
          <Image src={content?.projects_image || "/projects.png"} alt={t("title")} fill className="object-cover" />
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
