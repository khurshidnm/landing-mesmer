import { Suspense } from "react";
import { getSeo } from "@/lib/cms/server";
import React from "react";
import type { Metadata } from "next";
import Career from "./page-view";
import { getVacancies } from "@/app/admin/(admin)/(root)/vacancies/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const isEn = locale === "en";
  const isRu = locale === "ru";

  let title = isEn
    ? "Careers & Engineering Jobs | Water Infrastructure EPC | MESMER"
    : isRu
    ? "Карьера и вакансии в строительстве водной инфраструктуры | MESMER"
    : "Karyera va bo'sh ish o'rinlari | Suv inshootlari qurilishi | MESMER";

  let description = isEn
    ? "Join MESMER engineering team. Discover career opportunities in municipal WWTP, WTP construction, and water infrastructure EPC projects across Uzbekistan."
    : isRu
    ? "Работа в MESMER: открытые вакансии инженеров, проектировщиков и специалистов по строительству КОС и ВОС в Узбекистане."
    : "MESMER jamoasiga qo'shiling: suv tozalash va oqova suv inshootlari qurilishi bo'yicha bo'sh ish o'rinlari.";

  // Website Content → SEO overrides the built-in texts
  ({ title, description } = await getSeo("career", locale, { title, description }));

  const canonicalUrl = `https://www.mesmer.uz/${locale}/career`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.mesmer.uz/en/career",
        ru: "https://www.mesmer.uz/ru/career",
        uz: "https://www.mesmer.uz/uz/career",
        "x-default": "https://www.mesmer.uz/en/career",
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
          url: "https://www.mesmer.uz/vacancy.png",
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
      images: ["https://www.mesmer.uz/vacancy.png"],
    },
  };
}

const CareerPage = async () => {
  const vacanciesJson = await getVacancies();
  const vacancies = parseServerActionJson<any[]>(vacanciesJson, []);

  return (
    <Suspense>
      <Career vacancies={Array.isArray(vacancies) ? vacancies : []} />
    </Suspense>
  );
};

export default CareerPage;
