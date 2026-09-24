import type { Metadata } from "next";
import { getSeo } from "@/lib/cms/server";
import ProjectsDatabase from "./projects-database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ProjectsItem {
  _id: string;
  uz: {
    title: string;
    main_title: string;
    description: string;
    volume_of_tasks: string;
    customer: string;
    status: string;
    implementation_period: string;
    meta_title?: string;
    meta_description?: string;
    city?: string;
  };
  en: {
    title: string;
    main_title: string;
    description: string;
    volume_of_tasks: string;
    customer: string;
    status: string;
    implementation_period: string;
    meta_title?: string;
    meta_description?: string;
    city?: string;
  };
  ru: {
    title: string;
    main_title: string;
    description: string;
    volume_of_tasks: string;
    customer: string;
    status: string;
    implementation_period: string;
    meta_title?: string;
    meta_description?: string;
    city?: string;
  };
  slug: string;
  cover: string;
  gallery: string[];
  project_type?: string;
  // Structured fields (project database)
  country?: string;
  financier?: string;
  contract_type?: string;
  category?: string;
  stage?: string;
  capacity_value?: number | null;
  capacity_unit?: string;
  population_served?: number | null;
  start_date?: string;
  end_date?: string;
}

export interface ProjectsGridProps {
  items: ProjectsItem[];
  onPreview: (slug: string) => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const lang = (locale as "en" | "ru" | "uz") || "en";

  const metaData = {
    en: {
      title: "Water & Wastewater Treatment EPC Projects Uzbekistan | WWTP & WTP Contractor | MESMER",
      description: "Explore MESMER's portfolio of WWTP and WTP construction projects across Uzbekistan and Central Asia, including major ADB and EBRD financed water infrastructure contracts.",
    },
    ru: {
      title: "Проекты строительства ВОС и КОС в Узбекистане | Подрядчик водной инфраструктуры | MESMER",
      description: "Портфолио проектов MESMER: строительство и реконструкция очистных сооружений (КОС/ВОС), насосных станций и водопроводных сетей в Узбекистане при поддержке ЕБРР и АБР.",
    },
    uz: {
      title: "O'zbekistonda suv va oqova suv tozalash EPC loyihalari | WWTP va WTP inshootlari | MESMER",
      description: "MESMER kompaniyasining suv tozalash (WTP) va oqova suv tozalash (WWTP) loyihalari portfeli. OTB, EBRD va Jahon banki xalqaro infratuzilma shartnomalari.",
    },
  };

  let title = metaData[lang]?.title || metaData.en.title;
  let description = metaData[lang]?.description || metaData.en.description;
  // Website Content → SEO overrides the built-in texts
  ({ title, description } = await getSeo("projects", locale, { title, description }));

  const canonicalUrl = `https://www.mesmer.uz/${locale}/projects`;

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
      "water supply project Uzbekistan",
      "MESMER projects portfolio",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.mesmer.uz/en/projects",
        ru: "https://www.mesmer.uz/ru/projects",
        uz: "https://www.mesmer.uz/uz/projects",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: "https://www.mesmer.uz/projects.png",
          width: 1200,
          height: 630,
          alt: "MESMER Water Treatment EPC Projects Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.mesmer.uz/projects.png"],
    },
  };
}

export default async function ProjectsPage(props: PageProps & {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await props.params;
  return <ProjectsDatabase locale={locale} searchParams={await props.searchParams} />;
}
