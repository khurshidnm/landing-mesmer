"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "@/components/BluredImage";
import { useLocale, useTranslations } from "next-intl";
import { t as cmsText } from "@/lib/cms/definitions";
import type { HomeContent } from "@/lib/cms/content-types";
import SectionHeading from "./SectionHeading";

const EYEBROW = { en: "UN Sustainable Development Goals", ru: "Цели устойчивого развития ООН", uz: "BMT barqaror rivojlanish maqsadlari" } as const;


const goals = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  img: `/goals/goals${i + 1}.png`,
  animate: [6, 7, 8, 9, 11, 13, 17].includes(i + 1),
}));

const Goals = ({ content }: { content?: HomeContent }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const tr = useTranslations("home.goals");
  const locale = useLocale();
  const t = (key: "title" | "description") =>
    cmsText(content?.[key === "title" ? "goals_title" : "goals_description"], locale) || tr(key);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        align="center"
        eyebrow={EYEBROW[locale as keyof typeof EYEBROW] || EYEBROW.en}
        title={t("title")}
        description={t("description")}
      />

      <motion.div
        ref={ref}
        className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {goals?.map((goal) => (
          <motion.div
            key={goal.id}
            variants={{
              hidden: { opacity: 0, scale: 0.7 },
              visible: { opacity: 1, scale: 1 },
            }}
            className="relative group"
          >
            <div
              className={`aspect-square overflow-hidden rounded-lg transition-all duration-300 ${
                goal.animate || goal.id === 18
                  ? "shadow-md ring-2 ring-blue-600 ring-offset-2"
                  : "opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0"
              }`}
            >
              <Image
                src={goal.img}
                alt={`Goal ${goal.id}`}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Goals;
