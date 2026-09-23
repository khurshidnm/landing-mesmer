"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Hero from "../../components/Hero";
import Gallery from "../../components/Gallery";
import { useLocale, useTranslations } from "next-intl";
import Footer from "../../components/Footer";
import type { ProjectsItem } from "../page";

export default function ProjectPage({ project }: { project: ProjectsItem | null }) {
  const locale = useLocale() as "uz" | "ru" | "en";
  const t = useTranslations("projects");
  const localizedProject = project?.[locale];

  // A slug that matches nothing comes back as null from the server action
  if (!project || !localizedProject) {
    return (
      <>
        <Hero
          title=""
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

  // Key facts, rendered as a spec sheet beside the description
  const facts = [
    { label: t("project.customer"), value: localizedProject.customer },
    {
      label: t("project.implementation"),
      value: localizedProject.implementation_period,
    },
    { label: t("project.status"), value: localizedProject.status },
    { label: t("project.task"), value: localizedProject.volume_of_tasks },
  ].filter((fact) => fact.value);

  return (
    <>
      <Hero
        title=""
        subtitle={`${t("title")} / ${localizedProject.title}`}
        backgroundImage="/our.png"
        height="500px"
      />
      <article className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-0">
          {/* Back to the list */}
          <div className="pt-8">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </Link>
          </div>

          <div className="pt-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h1 className="text-3xl font-bold text-black mb-2">
                {t("single")}
              </h1>
              <h2 className="text-2xl text-gray-800">
                {localizedProject.main_title || localizedProject.title}
              </h2>
            </div>
          </div>

          {/* Project Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mt-8 w-full h-[240px] sm:h-[350px] md:h-[450px] lg:h-[540px] overflow-hidden rounded-xl sm:rounded-2xl shadow-sm bg-gray-100"
          >
            <Image
              src={project.cover}
              alt={localizedProject.title || "Проект"}
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div
                className="prose max-w-none text-base sm:text-lg leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: localizedProject.description || "",
                }}
              />
            </motion.div>

            {/* Spec sheet */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <dl className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-gray-50 lg:sticky lg:top-8">
                {facts.map((fact) => (
                  <div key={fact.label} className="px-6 py-5">
                    <dt className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {fact.label}
                    </dt>
                    <dd className="text-sm sm:text-base leading-relaxed text-gray-900">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.aside>
          </div>
        </div>
      </div>

        {project.gallery?.length > 0 && <Gallery photos={project.gallery} />}
      </article>
      <Footer />
    </>
  );
}
