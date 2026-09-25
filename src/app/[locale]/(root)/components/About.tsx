"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import Image from "@/components/BluredImage";
import { useLocale, useTranslations } from "next-intl";
import { t as cmsText } from "@/lib/cms/definitions";
import type { HomeContent } from "@/lib/cms/content-types";
import SectionHeading from "./SectionHeading";

const MORE = { en: "More about the company", ru: "Подробнее о компании", uz: "Kompaniya haqida batafsil" } as const;

const AboutCompany = ({ content }: { content?: HomeContent }) => {
  const tr = useTranslations("home.about");
  const locale = useLocale();
  // Website Content → Home Page Texts, falling back to the translation files
  const t = (key: string) => {
    const field = { title: "about_title", subtitle: "about_subtitle", description: "about_description", "task.title": "mission_title", "task.description": "mission_description" }[key];
    return (field && cmsText(content?.[field as keyof HomeContent] as Record<string, string>, locale)) || tr(key);
  };

  const images = [
    { src: content?.about_image_1 || "/work1.png", alt: "MESMER construction team on site" },
    { src: content?.about_image_2 || "/work2.png", alt: "MESMER engineers at work" },
    { src: content?.about_image_3 || "/work3.png", alt: "MESMER partnership" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading size="md" eyebrow={t("title")} title={t("subtitle")} description={t("description")} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative h-64 overflow-hidden rounded-lg shadow-sm"
          >
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Target className="h-5 w-5" />
          </span>
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-gray-950 sm:text-xl">{t("task.title")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{t("task.description")}</p>
          </div>
        </div>
        <Link
          href={`/${locale}/about`}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-blue-600 hover:text-blue-700 lg:self-center"
        >
          {MORE[locale as keyof typeof MORE] || MORE.en}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default AboutCompany;
