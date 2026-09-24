"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Hero from "../../components/Hero";
import Gallery from "../../components/Gallery";
import { useLocale, useTranslations } from "next-intl";
import Footer from "../../components/Footer";
import { getStatusColor, normalizeStatusDisplay } from "@/lib/project-status";
import type { ProjectsItem } from "../page";
import { t as tr, type I18nText } from "@/lib/cms/definitions";
import {
  categoryLabel,
  contractLabel,
  countryName,
  formatCapacity,
  formatPopulation,
  labels,
} from "@/lib/project-display";

export default function ProjectPage({
  project,
  relatedProjects = [],
  financierName,
  financierFullName,
}: {
  project: ProjectsItem | null;
  relatedProjects?: ProjectsItem[];
  financierName?: string;
  financierFullName?: I18nText;
}) {
  const locale = useLocale() as "uz" | "ru" | "en";
  const t = useTranslations("projects");
  const localizedProject = project?.[locale];

  // A slug that matches nothing comes back as null from the server action
  if (!project || !localizedProject) {
    return (
      <>
        <Hero
          subtitle={t("title")}
          backgroundImage="/our.png"
          height="500px"
        />
        <div className="container mx-auto py-24 text-center">
          <p className="text-lg text-gray-600 mb-6">{t("not_found")}</p>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Determine project category tag for targeted SEO
  const textCorpus = `${localizedProject.title} ${localizedProject.main_title} ${localizedProject.volume_of_tasks} ${localizedProject.description}`.toLowerCase();
  let categoryTag = "Water Infrastructure EPC Project";
  if (textCorpus.includes("wwtp") || textCorpus.includes("oqova") || textCorpus.includes("очистн")) {
    categoryTag = "WWTP EPC Central Asia | Wastewater Treatment";
  } else if (textCorpus.includes("wtp") || textCorpus.includes("suv tozalash") || textCorpus.includes("водоочист")) {
    categoryTag = "WTP Construction Uzbekistan | Water Treatment Plant";
  } else if (textCorpus.includes("adb") || textCorpus.includes("asian development") || textCorpus.includes("otb")) {
    categoryTag = "ADB Water Projects Uzbekistan";
  } else if (textCorpus.includes("ebrd") || textCorpus.includes("reconstruction and development") || textCorpus.includes("ебрр")) {
    categoryTag = "EBRD Water Projects Uzbekistan";
  }

  // Key facts, rendered as a spec sheet beside the description
  const statusColor = getStatusColor(localizedProject.status);
  const text = labels(locale);
  const facts = [
    { label: t("project.customer"), value: localizedProject.customer },
    {
      label: text.location,
      value: [localizedProject.city, countryName(project.country, locale)].filter(Boolean).join(", "),
    },
    {
      label: locale === "ru" ? "Направление" : locale === "uz" ? "Yo‘nalish" : "Service",
      value: categoryLabel(project.category, locale),
    },
    {
      label: text.financier,
      value: financierName
        ? `${financierName}${financierFullName && tr(financierFullName, locale) !== financierName ? ` — ${tr(financierFullName, locale)}` : ""}`
        : "",
    },
    { label: text.contract, value: contractLabel(project.contract_type, locale) },
    { label: text.capacity, value: formatCapacity(project.capacity_value, project.capacity_unit, locale) },
    { label: text.population, value: formatPopulation(project.population_served, locale) },
    {
      label: t("project.implementation"),
      value: localizedProject.implementation_period,
    },
    { label: t("project.status"), value: normalizeStatusDisplay(localizedProject.status, locale), isStatus: true },
    { label: t("project.task"), value: localizedProject.volume_of_tasks },
  ].filter((fact) => fact.value);

  return (
    <>
      <Hero
        subtitle={`${t("title")} / ${localizedProject.title}`}
        backgroundImage="/our.png"
        height="500px"
        headingTag="div"
      />

      {/* Schema.org BreadcrumbList & Project JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `https://www.mesmer.uz/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Projects",
                item: `https://www.mesmer.uz/${locale}/projects`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: localizedProject.title,
                item: `https://www.mesmer.uz/${locale}/projects/${project.slug}`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Project", "CreativeWork"],
            name: localizedProject.title,
            headline: localizedProject.title,
            description: localizedProject.volume_of_tasks || localizedProject.description,
            image: project.cover?.startsWith("http")
              ? project.cover
              : `https://www.mesmer.uz${project.cover || "/banner.png"}`,
            url: `https://www.mesmer.uz/${locale}/projects/${project.slug}`,
            provider: {
              "@type": "Organization",
              name: "MESMER",
              url: "https://www.mesmer.uz",
              logo: "https://www.mesmer.uz/blacklogo.svg",
            },
            locationCreated: {
              "@type": "Place",
              name: "Uzbekistan",
            },
          }),
        }}
      />
      <article className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-0">
          {/* Breadcrumbs / Back link */}
          <nav aria-label="Breadcrumb" className="pt-8 flex items-center justify-between">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </Link>
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
              {categoryTag}
            </span>
          </nav>

          {/* Primary H1 Heading Section */}
          <header className="pt-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1 block">
                {t("single")}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight leading-snug">
                {localizedProject.main_title || localizedProject.title}
              </h1>
            </div>
          </header>

          {/* Project Cover Image with rich Alt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mt-8 w-full h-[240px] sm:h-[350px] md:h-[450px] lg:h-[540px] overflow-hidden rounded-lg shadow-sm bg-gray-100"
          >
            <Image
              src={project.cover}
              alt={`${localizedProject.title} - Wastewater Treatment & Water Infrastructure EPC Contractor Uzbekistan`}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Main Content & Specs */}
          <div className="py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    {locale === "ru"
                      ? "Описание проекта и объем EPC-работ"
                      : locale === "uz"
                      ? "Loyiha tavsifi va EPC vazifalari"
                      : "Project Scope of Work & EPC Execution"}
                  </h2>
                  <div
                    className="article-content prose max-w-none text-base sm:text-lg leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: localizedProject.description || "",
                    }}
                  />
                </div>

                {/* Internal cross-linking callout */}
                <div className="p-6 rounded-lg bg-gray-50 border-l-4 border-blue-600 border border-gray-200 text-sm leading-relaxed text-gray-800">
                  <h3 className="font-bold text-base mb-1 text-gray-950">
                    {locale === "ru"
                      ? "Комплексные решения по водной инфраструктуре"
                      : locale === "uz"
                      ? "Suv infratuzilmasi bo'yicha kompleks yechimlar"
                      : "Comprehensive Water & Wastewater Infrastructure Solutions"}
                  </h3>
                  <p className="text-gray-600">
                    {locale === "ru" ? (
                      <>
                        MESMER выполняет полный цикл работ в качестве генерального подрядчика (EPC) по строительству очистных сооружений (КОС/ВОС), насосных станций и магистральных сетей. Ознакомьтесь с нашими{" "}
                        <Link href={`/${locale}/services`} className="font-semibold text-blue-600 underline hover:text-blue-800">
                          инжиниринговыми услугами и сферами деятельности
                        </Link>
                        .
                      </>
                    ) : locale === "uz" ? (
                      <>
                        MESMER suv tozalash (WTP) va oqova suv tozalash (WWTP) inshootlari, nasos stansiyalarini EPC asosida qurish bo&apos;yicha yetakchi hisoblanadi. Batafsil ma&apos;lumot olish uchun bizning{" "}
                        <Link href={`/${locale}/services`} className="font-semibold text-blue-600 underline hover:text-blue-800">
                          xizmatlarimiz va ekspertizamiz
                        </Link>{" "}
                        bilan tanishing.
                      </>
                    ) : (
                      <>
                        MESMER operates as a premier full-cycle EPC contractor for wastewater treatment plants (WWTP), drinking water treatment (WTP), and municipal water infrastructure across Uzbekistan and Central Asia. Explore our{" "}
                        <Link href={`/${locale}/services`} className="font-semibold text-blue-600 underline hover:text-blue-800">
                          engineering & EPC contracting services
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              </motion.div>

              {/* Spec sheet */}
              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-8 space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-3">
                    {locale === "ru"
                      ? "Параметры контракта"
                      : locale === "uz"
                      ? "Shartnoma ma'lumotlari"
                      : "Contract & Financing Specifications"}
                  </h2>
                  <dl className="divide-y divide-gray-200">
                    {facts.map((fact) => (
                      <div key={fact.label} className="py-3">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                          {fact.label}
                        </dt>
                        <dd className="text-sm font-medium text-gray-900 leading-snug">
                          {(fact as { isStatus?: boolean }).isStatus ? (
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-semibold ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                              {fact.value}
                            </span>
                          ) : (
                            fact.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.aside>
            </div>
          </div>

          {/* Photo Gallery with accessible alt tags */}
          {project.gallery?.length > 0 && (
            <Gallery photos={project.gallery} title={localizedProject.title} />
          )}

          {/* Related Projects Section (Internal Linking Hub) */}
          {relatedProjects.length > 0 && (
            <section className="py-12 border-t border-gray-100 my-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-950">
                    {locale === "ru"
                      ? "Похожие инфраструктурные проекты"
                      : locale === "uz"
                      ? "Boshqa suv infratuzilmasi loyihalari"
                      : "Related Water & Wastewater Infrastructure Projects"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {locale === "ru"
                      ? "Другие проекты ВОС/КОС, реализованные MESMER в Узбекистане и Центральной Азии"
                      : locale === "uz"
                      ? "MESMER tomonidan O'zbekiston va mintaqada amalga oshirilgan boshqa loyihalar"
                      : "Explore more WWTP EPC, WTP construction, and IFI water projects executed by MESMER"}
                  </p>
                </div>
                <Link
                  href={`/${locale}/projects`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 hidden sm:inline-flex items-center gap-1"
                >
                  {t("view_more") || "All Projects"} &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.slice(0, 3).map((rel) => {
                  const relLoc = rel[locale] || rel.en || rel.ru;
                  return (
                    <Link
                      key={rel._id}
                      href={`/${locale}/projects/${rel.slug}`}
                      className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                        <Image
                          src={rel.cover || "/placeholder.svg"}
                          alt={`${relLoc?.title || "Related Project"} - MESMER`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base mb-2">
                          {relLoc?.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {relLoc?.volume_of_tasks}
                        </p>
                        <span className="text-xs font-semibold text-blue-600 mt-auto inline-flex items-center gap-1">
                          {t("view_more") || "View Details"} &rarr;
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </article>
      <Footer />
    </>
  );
}
