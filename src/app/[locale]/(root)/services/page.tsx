import React from "react";
import ServicesClientView from "./client-view";
import { getConsts } from "@/app/admin/(admin)/(root)/consts/server-action";
import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { Metadata } from "next";
import type { ProjectsItem } from "../projects/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const constsRaw = await getConsts();
  const constants = parseServerActionJson<{
    services_seo?: {
      en?: { title?: string; description?: string };
      ru?: { title?: string; description?: string };
      uz?: { title?: string; description?: string };
    };
  } | null>(constsRaw, null);

  const lang = (locale as "en" | "ru" | "uz") || "en";
  const customSeo = constants?.services_seo?.[lang];

  // Default SEO copy tailored to target query pool
  const defaultMeta = {
    en: {
      title: "Water Treatment Company Uzbekistan | Wastewater Treatment EPC Contractor | MESMER",
      description: "MESMER is a premier water treatment company and wastewater treatment plant EPC contractor in Uzbekistan & Central Asia. Leading WWTP contractor, WTP construction, ADB and EBRD water projects.",
    },
    ru: {
      title: "EPC-подрядчик водоочистных сооружений и ВОС/КОС в Узбекистане | MESMER",
      description: "MESMER — генеральный EPC-подрядчик по проектированию и строительству водоочистных станций (ВОС) и очистных сооружений канализации (КОС) в Узбекистане и Центральной Азии. Проекты ЕБРР и АБР.",
    },
    uz: {
      title: "O'zbekistonda suv tozalash va oqova suv tozalash inshootlari EPC pudratchisi | MESMER",
      description: "MESMER — O'zbekiston va Markaziy Osiyoda suv tozalash (WTP) va oqova suv tozalash inshootlari (WWTP) bo'yicha yetakchi EPC bosh pudratchisi. OTB va EBRD xalqaro suv loyihalari.",
    },
  };

  const title = customSeo?.title?.trim() || defaultMeta[lang]?.title || defaultMeta.en.title;
  const description = customSeo?.description?.trim() || defaultMeta[lang]?.description || defaultMeta.en.description;

  const canonicalUrl = `https://www.mesmer.uz/${locale}/services`;

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
      "water treatment plant engineering",
      "MESMER services Uzbekistan",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.mesmer.uz/en/services",
        ru: "https://www.mesmer.uz/ru/services",
        uz: "https://www.mesmer.uz/uz/services",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: "https://www.mesmer.uz/services.png",
          width: 1200,
          height: 630,
          alt: "MESMER Water Treatment & Wastewater EPC Contractor Uzbekistan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.mesmer.uz/services.png"],
    },
  };
}

const ServicesPage = async () => {
  const projectsData = await getProjects({
    page: 1,
    limit: 6,
    slug: null,
  });

  const parsed = parseServerActionJson<{ projects: ProjectsItem[] } | null>(
    projectsData,
    null
  );

  return <ServicesClientView featuredProjects={parsed?.projects || []} />;
};

export default ServicesPage;
