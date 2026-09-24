import React from "react";
import { getSeo } from "@/lib/cms/server";
import type { Metadata } from "next";
import ContactClientView from "./client-view";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const isEn = locale === "en";
  const isRu = locale === "ru";

  let title = isEn
    ? "Contact MESMER | Water Infrastructure & Wastewater EPC Contractor"
    : isRu
    ? "Контакты MESMER | Строительство КОС, ВОС и водной инфраструктуры"
    : "Bog'lanish | MESMER suv va oqova suv inshootlari bosh pudratchisi";

  let description = isEn
    ? "Contact MESMER for turnkey engineering, WTP construction, WWTP EPC, and municipal water infrastructure projects in Uzbekistan and Central Asia."
    : isRu
    ? "Свяжитесь с MESMER для реализации проектов строительства и реконструкции очистных сооружений канализации и водоснабжения."
    : "Suv tozalash, oqova suv tozalash inshootlari va suv ta'minoti loyihalari bo'yicha MESMER bilan bog'laning.";

  // Website Content → SEO overrides the built-in texts
  ({ title, description } = await getSeo("contact", locale, { title, description }));

  const canonicalUrl = `https://www.mesmer.uz/${locale}/contact`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.mesmer.uz/en/contact",
        ru: "https://www.mesmer.uz/ru/contact",
        uz: "https://www.mesmer.uz/uz/contact",
        "x-default": "https://www.mesmer.uz/en/contact",
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
          url: "https://www.mesmer.uz/contact.png",
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
      images: ["https://www.mesmer.uz/contact.png"],
    },
  };
}

export default function ContactPage() {
  return <ContactClientView />;
}
