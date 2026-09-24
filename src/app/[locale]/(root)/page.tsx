import React from "react";
import HomePageInner from "./client-view";
import { getSertificates } from "../../admin/(admin)/(root)/certificates/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { Certificate } from "@/types/certificates";
import { getEntries, getSeo, getSingleton } from "@/lib/cms/server";
import { CMS_DEFAULTS } from "@/lib/cms/defaults";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";
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

  const [hero, stats, expertise, financiers, homeContent, partners] = await Promise.all([
    getSingleton("hero"),
    getEntries("stats"),
    getEntries("expertise"),
    getEntries("financiers"),
    getSingleton("home_content"),
    getEntries("partners"),
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
    />
  );
};

export default HomePage;
