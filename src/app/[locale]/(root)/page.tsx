import React from "react";
import HomePageInner from "./client-view";
import { getSertificates } from "../../admin/(admin)/(root)/certificates/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { Certificate } from "@/types/certificates";
import { getEntries, getSeo, getSingleton } from "@/lib/cms/server";
import { CMS_DEFAULTS } from "@/lib/cms/defaults";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";
import { connectToDatabase } from "@/lib/mongoose";
import Projects from "@/database/projects.model";
import type { ProjectCardData } from "@/components/project-card";
import {
  serialize,
  type ExpertiseEntry,
  type FinancierEntry,
  type HeroContent,
  type HomeContent,
  type PartnerEntry,
  type StatEntry,
} from "@/lib/cms/content-types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = pickLocale((await params).locale);
  const builtIn = CMS_DEFAULTS.seo.find((e) => e.data.page === "home")?.data as {
    title: Record<string, string>;
    description: Record<string, string>;
  };
  const seo = await getSeo("home", locale, { title: builtIn.title[locale], description: builtIn.description[locale] });
  return pageMetadata({ locale, path: "", ...seo });
}

const HomePage = async () => {
  const certsJson = await getSertificates();
  const certificates = parseServerActionJson<Certificate[]>(certsJson, []);

  // Latest projects for the home page (newest start date first)
  const latestProjects = async (): Promise<ProjectCardData[]> => {
    try {
      await connectToDatabase();
      return JSON.parse(JSON.stringify(await Projects.find({}).sort({ start_date: -1, createdAt: -1 }).limit(3).lean()));
    } catch (error) {
      console.error("Failed to load latest projects:", error);
      return [];
    }
  };

  const [hero, stats, expertise, financiers, homeContent, partners, projects] = await Promise.all([
    getSingleton("hero"),
    getEntries("stats"),
    getEntries("expertise"),
    getEntries("financiers"),
    getSingleton("home_content"),
    getEntries("partners"),
    latestProjects(),
  ]);

  return (
    <HomePageInner
      certificates={certificates}
      hero={serialize(hero) as HeroContent}
      stats={serialize(stats) as StatEntry[]}
      expertise={serialize(expertise as ExpertiseEntry[]).filter((e) => e.featured)}
      financiers={serialize(financiers) as FinancierEntry[]}
      content={serialize(homeContent) as HomeContent}
      partners={(serialize(partners) as PartnerEntry[]).filter((p) => p.show_on_home && p.logo)}
      projects={projects}
    />
  );
};

export default HomePage;
