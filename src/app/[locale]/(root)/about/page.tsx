import React from "react";
import type { Metadata } from "next";
import AboutClientView from "./client-view";
import { getSertificates } from "../../../admin/(admin)/(root)/certificates/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { Certificate } from "@/types/certificates";
import { getEntries, getSeo, getSingleton } from "@/lib/cms/server";
import { serialize, type AboutContent, type FinancierEntry, type PartnerEntry, type StatEntry } from "@/lib/cms/content-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const isEn = locale === "en";
  const isRu = locale === "ru";

  let title = isEn
    ? "About MESMER | Water Treatment & Wastewater EPC Contractor Uzbekistan"
    : isRu
    ? "О компании MESMER | Строительство КОС и ВОС в Узбекистане"
    : "MESMER haqida | O'zbekistonda suv va oqova suv tozalash inshootlari qurilishi";

  let description = isEn
    ? "Learn about MESMER — leading EPC contractor in Uzbekistan specializing in turnkey water treatment plants (WTP), wastewater treatment plants (WWTP), and municipal water infrastructure."
    : isRu
    ? "MESMER — генеральный подрядчик в Узбекистане по строительству и модернизации очистных сооружений канализации (КОС), водоочистных станций (ВОС) и насосных станций."
    : "MESMER — O'zbekistonda suv tozalash, oqova suv tozalash (WWTP/WTP) va nasos stansiyalari qurilishi bo'yicha yetakchi EPC bosh pudratchi kompaniya.";

  // Website Content → SEO overrides the built-in texts
  ({ title, description } = await getSeo("about", locale, { title, description }));

  const canonicalUrl = `https://www.mesmer.uz/${locale}/about`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.mesmer.uz/en/about",
        ru: "https://www.mesmer.uz/ru/about",
        uz: "https://www.mesmer.uz/uz/about",
        "x-default": "https://www.mesmer.uz/en/about",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "MESMER",
      images: [
        {
          url: "https://www.mesmer.uz/about.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.mesmer.uz/about.png"],
    },
  };
}

export default async function AboutPage() {
  const [certsJson, financiers, content, partners, stats] = await Promise.all([
    getSertificates(),
    getEntries("financiers"),
    getSingleton("about_page"),
    getEntries("partners"),
    getEntries("stats"),
  ]);
  return (
    <AboutClientView
      certificates={parseServerActionJson<Certificate[]>(certsJson, [])}
      financiers={serialize(financiers) as FinancierEntry[]}
      content={serialize(content) as AboutContent}
      partners={(serialize(partners) as PartnerEntry[]).filter((p) => p.show_on_about && p.logo)}
      stats={serialize(stats) as StatEntry[]}
    />
  );
}
