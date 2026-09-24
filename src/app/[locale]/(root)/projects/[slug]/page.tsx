import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import React from "react";
import ProjectPage from "./page-view";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { ProjectsItem } from "../page";
import { getEntries } from "@/lib/cms/server";
import type { FinancierEntry } from "@/lib/cms/content-types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const projectJson = await getProjects({ page: 1, limit: 1, slug });
  const project = parseServerActionJson<ProjectsItem | null>(projectJson, null);

  if (!project) {
    return {
      title: "Project Not Found | MESMER Uzbekistan",
      description: "The requested project could not be found.",
    };
  }

  const lang = (locale as "en" | "ru" | "uz") || "en";
  const localized = project[lang] || project.en || project.ru || project.uz;

  // Primary: use custom CMS meta_title if available
  let title = localized?.meta_title?.trim();
  if (!title) {
    const pTitle = localized?.main_title || localized?.title || "Water Project";
    const textCorpus = `${pTitle} ${localized?.volume_of_tasks || ""} ${localized?.description || ""}`.toLowerCase();

    if (textCorpus.includes("wwtp") || textCorpus.includes("oqova") || textCorpus.includes("очистн")) {
      title = `${pTitle} | WWTP EPC Central Asia | MESMER`;
    } else if (textCorpus.includes("wtp") || textCorpus.includes("suv tozalash") || textCorpus.includes("водоочист")) {
      title = `${pTitle} | WTP Construction Uzbekistan | MESMER`;
    } else if (textCorpus.includes("adb") || textCorpus.includes("asian development") || textCorpus.includes("otb")) {
      title = `${pTitle} | ADB Water Projects Uzbekistan | MESMER`;
    } else if (textCorpus.includes("ebrd") || textCorpus.includes("reconstruction and development") || textCorpus.includes("ебрр")) {
      title = `${pTitle} | EBRD Water Projects Uzbekistan | MESMER`;
    } else {
      title = `${pTitle} | Water Infrastructure Contractor Uzbekistan | MESMER`;
    }
  }

  // Primary: use custom CMS meta_description if available
  let description = localized?.meta_description?.trim();
  if (!description) {
    const snippet = localized?.volume_of_tasks || localized?.description?.replace(/<[^>]*>?/gm, "").slice(0, 140) || "";
    description = `${snippet ? `${snippet}. ` : ""}Delivered by MESMER — leading water infrastructure and wastewater treatment plant EPC contractor in Uzbekistan & Central Asia.`;
  }

  const canonicalUrl = `https://www.mesmer.uz/${locale}/projects/${slug}`;
  const ogImage = project.cover
    ? project.cover.startsWith("http")
      ? project.cover
      : `https://www.mesmer.uz${project.cover}`
    : "https://www.mesmer.uz/banner.png";

  return {
    title,
    description,
    keywords: [
      "water treatment company Uzbekistan",
      "wastewater treatment EPC contractor",
      "WWTP contractor Central Asia",
      "WTP construction Uzbekistan",
      "water infrastructure contractor Uzbekistan",
      "wastewater treatment plant EPC",
      "ADB water projects Uzbekistan",
      "EBRD water projects Uzbekistan",
      "WWTP EPC Central Asia",
      localized?.title || "",
      localized?.customer || "",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://www.mesmer.uz/en/projects/${slug}`,
        ru: `https://www.mesmer.uz/ru/projects/${slug}`,
        uz: `https://www.mesmer.uz/uz/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: localized?.title || "MESMER Project",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const page = async (props: PageProps) => {
  const params = await props.params;
  const projectJson = await getProjects({
    page: 1,
    limit: 1,
    slug: params.slug,
  });

  const allProjectsJson = await getProjects({
    page: 1,
    limit: 8,
    slug: null,
  });

  const project = parseServerActionJson<ProjectsItem | null>(projectJson, null);
  const parsedAll = parseServerActionJson<{ projects: ProjectsItem[] } | null>(
    allProjectsJson,
    null
  );

  const relatedProjects = (parsedAll?.projects || []).filter(
    (p) => p.slug !== params.slug
  );

  // Prefer related projects of the same category
  if (project?.category) {
    relatedProjects.sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category));
  }
  const financiers = (await getEntries("financiers")) as FinancierEntry[];
  const financier = financiers.find((f) => f.slug === project?.financier);

  return (
    <ProjectPage
      project={project}
      relatedProjects={relatedProjects}
      financierName={financier?.name || ""}
      financierFullName={financier ? JSON.parse(JSON.stringify(financier.full_name)) : undefined}
    />
  );
};

export default page;
