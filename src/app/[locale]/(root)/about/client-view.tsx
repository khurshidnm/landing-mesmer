"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Advantages from "../components/Features";
import FinanciersBlock from "../components/FinanciersBlock";
import type { Certificate } from "@/types/certificates";
import type { FinancierEntry } from "@/lib/cms/content-types";
import { useTranslations, useLocale } from "next-intl";
import { t as cmsText, tList } from "@/lib/cms/definitions";
import type { AboutContent, PartnerEntry } from "@/lib/cms/content-types";

// Translation key → Website Content → About Page field
const FIELD: Record<string, keyof AboutContent> = {
  main_title: "hero_title",
  title: "intro_title",
  description: "intro_text",
  "goals.title": "goals_title",
  "goals.description": "goals_text",
  "competition.title": "competition_title",
  "competition.description": "competition_text",
  "ethics.title": "ethics_title",
  "ethics.description": "ethics_text",
  "quality.title": "quality_title",
  "quality.description": "quality_text",
  "quality.sub_description": "quality_footer",
  "partners.title": "partners_title",
  "partners.description": "partners_text",
};

const DEFAULT_PARTNER_LOGOS = Array.from({ length: 24 }, (_, i) => `/our-partners/partner${i + 1}.svg`);

export default function AboutClientView({
  certificates = [],
  financiers = [],
  content,
  partners: partnerEntries,
}: {
  certificates?: Certificate[];
  financiers?: FinancierEntry[];
  content?: AboutContent;
  partners?: PartnerEntry[];
}) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  } as const;

  const tr = useTranslations("about");
  const locale = useLocale();
  // Website Content → About Page, falling back to the translation files
  const t = (key: string) =>
    (FIELD[key] && cmsText(content?.[FIELD[key]] as Record<string, string>, locale)) || tr(key);
  const qualityPoints = tList(content?.quality_points, locale);
  const partners = partnerEntries
    ? partnerEntries.map((p) => ({ src: p.logo, name: p.name }))
    : DEFAULT_PARTNER_LOGOS.map((src) => ({ src, name: "" }));

  return (
    <div className="overflow-hidden bg-white">
      {/* Schema.org BreadcrumbList */}
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
                name: "About Us",
                item: `https://www.mesmer.uz/${locale}/about`,
              },
            ],
          }),
        }}
      />

      <Hero
        title={t("main_title")}
        subtitle=""
        backgroundImage={content?.hero_image || "/about.png"}
        height="500px"
        headingTag="h1"
      />

      <section id="company" className="px-4 py-8 container mx-auto scroll-mt-24">
        <div className="flex flex-col lg:flex-row items-start gap-12 w-full">
          <motion.div className="w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-950">{t("title")}</h2>
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md">
              <Image
                src={content?.intro_image || "/about2.png"}
                alt="MESMER Water Treatment Company Engineering Team"
                fill
                className="object-cover w-full"
              />
            </div>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{t("description")}</p>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full aspect-[21/9] relative my-6"
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src={content?.wide_image_1 || "/about3.png"}
          alt="MESMER Water Infrastructure Construction Site Uzbekistan"
          fill
          className="object-cover"
        />
      </motion.div>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div className="w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-950">{t("goals.title")}</h2>
              <div className="relative w-full aspect-[16/9] mb-4 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={content?.goals_image || "/about4.png"}
                  alt="MESMER Engineering Goals and EPC Standards"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-gray-700 leading-relaxed mb-8">
                {t("goals.description")}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-950">
                {t("competition.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("competition.description")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full aspect-[21/9] relative my-6"
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src={content?.wide_image_2 || "/about5.png"}
          alt="WWTP and WTP Engineering Project Construction Panorama"
          fill
          className="object-cover"
        />
      </motion.div>

      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div
            className="w-full hidden md:flex lg:w-1/2 aspect-[4/3] relative"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          ></motion.div>

          <motion.div
            className="w-full lg:w-1/2"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug text-gray-950">
                {t("ethics.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("ethics.description")}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-4 leading-snug text-gray-950">
                {t("quality.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("quality.description")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed mb-4">
                {(qualityPoints.length ? qualityPoints : [1, 2, 3, 4].map((n) => tr(`quality.list.label_${n}`))).map(
                  (point) => (
                    <li key={point}>{point}</li>
                  )
                )}
              </ul>
              <p className="text-gray-700 leading-relaxed">
                {t("quality.sub_description")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu: About Us → Certificates */}
      <div id="certificates" className="scroll-mt-24">
        <Advantages certificates={certificates} />
      </div>

      <FinanciersBlock financiers={financiers} />

      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-12 mb-8">
            <motion.div className="w-1/2"></motion.div>

            <motion.div
              className="w-full lg:w-1/2 space-y-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div>
                <h2 className="text-3xl font-bold mb-3 text-gray-950">{t("partners.title")}</h2>
                <p className="text-gray-700 leading-relaxed">{t("partners.description")}</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-2 mt-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 border border-collapse rounded-xl overflow-hidden shadow-sm bg-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {partners?.map((partner, index) => (
              <div
                key={index}
                className="relative aspect-square border p-4 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.src || "/placeholder.svg"}
                    alt={partner.name || `MESMER Partner Brand ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
