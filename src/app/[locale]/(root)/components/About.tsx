"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "@/components/BluredImage";
import { useLocale, useTranslations } from "next-intl";
import { t as cmsText } from "@/lib/cms/definitions";
import type { HomeContent } from "@/lib/cms/content-types";


const AboutCompany = ({ content }: { content?: HomeContent }) => {
  const tr = useTranslations("home.about");
  const locale = useLocale();
  // Website Content → Home Page Texts, falling back to the translation files
  const t = (key: string) => {
    const field = { title: "about_title", subtitle: "about_subtitle", description: "about_description", "task.title": "mission_title", "task.description": "mission_description" }[key];
    return (field && cmsText(content?.[field as keyof HomeContent] as Record<string, string>, locale)) || tr(key);
  };
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-12"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-0">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-gray-900 mb-6 sm:mb-10">
              {t("title")}
            </h2>
          </div>
          <div className="space-y-6 max-w-2xl">
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide mb-4 sm:mb-5">
                {t("subtitle")}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t("description")}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            src: content?.about_image_1 || "/work1.png",
            alt: "Construction workers",
          },
          {
            src: content?.about_image_2 || "/work2.png",
            alt: "Team collaboration",
          },
          {
            src: content?.about_image_3 || "/work3.png",
            alt: "Business handshake",
          },
        ]?.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative h-64 overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-12"
      >
        <div className="flex flex-col mt-5 lg:flex-row justify-between items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-0">
          <div>
            <div className="text-4xl sm:text-5xl mb-6 sm:mb-10" />
          </div>
          <div className="space-y-6 max-w-2xl">
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide mb-4 sm:mb-5">
                {t("task.title")}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t("task.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutCompany;
