import React from "react";
import { getSeo } from "@/lib/cms/server";
import type { Metadata } from "next";
import NewsClientView from "./client-view";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const isEn = locale === "en";
  const isRu = locale === "ru";

  let title = isEn
    ? "Company News & Water Infrastructure Updates | MESMER"
    : isRu
    ? "Новости компании и водная инфраструктура Узбекистана | MESMER"
    : "Kompaniya yangiliklari va suv inshootlari qurilishi | MESMER";

  let description = isEn
    ? "Latest corporate news, construction milestones, and project launches for WWTP, WTP, and water infrastructure across Uzbekistan by MESMER."
    : isRu
    ? "Актуальные новости, этапы строительства и запуск объектов КОС и ВОС в Узбекистане компанией MESMER."
    : "MESMER kompaniyasining so'nggi yangiliklari, suv va oqova suv tozalash inshootlari qurilishi borasidagi hisobotlar.";

  // Website Content → SEO overrides the built-in texts
  ({ title, description } = await getSeo("news", locale, { title, description }));

  const canonicalUrl = `https://www.mesmer.uz/${locale}/news`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.mesmer.uz/en/news",
        ru: "https://www.mesmer.uz/ru/news",
        uz: "https://www.mesmer.uz/uz/news",
        "x-default": "https://www.mesmer.uz/en/news",
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
          url: "https://www.mesmer.uz/news.png",
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
      images: ["https://www.mesmer.uz/news.png"],
    },
  };
}

export default function NewsPage() {
  return <NewsClientView />;
}
