"use client";

import Image from "@/components/BluredImage";
import { CheckCircle2, Handshake, Scale } from "lucide-react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Advantages from "../components/Features";
import FinanciersBlock from "../components/FinanciersBlock";
import type { Certificate } from "@/types/certificates";
import type { FinancierEntry } from "@/lib/cms/content-types";
import { useTranslations, useLocale } from "next-intl";
import { t as cmsText, tList } from "@/lib/cms/definitions";
import type { AboutContent, PartnerEntry, StatEntry } from "@/lib/cms/content-types";
import SectionHeading from "../components/SectionHeading";
import StatValue from "../components/StatValue";

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

const LABELS = {
  en: { company: "Company", goals: "Mission", principles: "Our principles", principlesTitle: "How we do business", quality: "Quality", partners: "Partners" },
  ru: { company: "Компания", goals: "Миссия", principles: "Наши принципы", principlesTitle: "Как мы ведём бизнес", quality: "Качество", partners: "Партнёры" },
  uz: { company: "Kompaniya", goals: "Missiya", principles: "Tamoyillarimiz", principlesTitle: "Biznesni qanday yuritamiz", quality: "Sifat", partners: "Hamkorlar" },
} as const;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6 },
} as const;

export default function AboutClientView({
  certificates = [],
  financiers = [],
  content,
  partners: partnerEntries,
  stats = [],
}: {
  certificates?: Certificate[];
  financiers?: FinancierEntry[];
  content?: AboutContent;
  partners?: PartnerEntry[];
  stats?: StatEntry[];
}) {
  const tr = useTranslations("about");
  const locale = useLocale();
  const labels = LABELS[locale as keyof typeof LABELS] || LABELS.en;
  // Website Content → About Page, falling back to the translation files
  const t = (key: string) =>
    (FIELD[key] && cmsText(content?.[FIELD[key]] as Record<string, string>, locale)) || tr(key);
  const qualityPoints = tList(content?.quality_points, locale);
  const points = qualityPoints.length ? qualityPoints : [1, 2, 3, 4].map((n) => tr(`quality.list.label_${n}`));
  const partners = partnerEntries
    ? partnerEntries.map((p) => ({ src: p.logo, name: p.name }))
    : DEFAULT_PARTNER_LOGOS.map((src) => ({ src, name: "" }));
  const keyNumbers = stats.filter((s) => s.show_in_hero).slice(0, 4);

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
              { "@type": "ListItem", position: 1, name: "Home", item: `https://www.mesmer.uz/${locale}` },
              { "@type": "ListItem", position: 2, name: "About Us", item: `https://www.mesmer.uz/${locale}/about` },
            ],
          }),
        }}
      />

      <Hero
        title={t("main_title")}
        subtitle="MESMER"
        backgroundImage={content?.hero_image || "/about.png"}
        height="420px"
        headingTag="h1"
      />

      {/* Company intro */}
      <section id="company" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20 scroll-mt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeIn}>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{labels.company}</span>
            <h2 className="mb-6 text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">{t("title")}</h2>
            <p className="leading-relaxed text-gray-700 sm:text-lg">{t("description")}</p>
            {keyNumbers.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {keyNumbers.map((stat) => (
                  <div key={stat._id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                      <StatValue value={stat.value} unitClassName="text-lg sm:text-xl" />
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{cmsText(stat.label, locale)}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          <motion.div {...fadeIn} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md">
            <Image
              src={content?.intro_image || "/about2.png"}
              alt="MESMER Water Treatment Company Engineering Team"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[21/9]">
          <Image
            src={content?.wide_image_1 || "/about3.png"}
            alt="MESMER Water Infrastructure Construction Site Uzbekistan"
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Goals */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeIn} className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md lg:order-1">
            <Image
              src={content?.goals_image || "/about4.png"}
              alt="MESMER Engineering Goals and EPC Standards"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div {...fadeIn} className="order-1 lg:order-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{labels.goals}</span>
            <h2 className="mb-6 text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">{t("goals.title")}</h2>
            <p className="leading-relaxed text-gray-700 sm:text-lg">{t("goals.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-gray-100 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading eyebrow={labels.principles} title={labels.principlesTitle} />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Scale, title: t("competition.title"), text: t("competition.description") },
              { icon: Handshake, title: t("ethics.title"), text: t("ethics.description") },
            ].map(({ icon: Icon, title, text }) => (
              <motion.div key={title} {...fadeIn} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-3 text-xl font-bold leading-snug text-gray-950">{title}</h3>
                <p className="leading-relaxed text-gray-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeIn}>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{labels.quality}</span>
            <h2 className="mb-6 text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">{t("quality.title")}</h2>
            <p className="mb-6 leading-relaxed text-gray-700">{t("quality.description")}</p>
            <ul className="mb-6 grid gap-3 sm:grid-cols-2">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-sm font-medium text-gray-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="leading-relaxed text-gray-600">{t("quality.sub_description")}</p>
          </motion.div>
          <motion.div {...fadeIn} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md">
            <Image
              src={content?.wide_image_2 || "/about5.png"}
              alt="WWTP and WTP Engineering Project Construction"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Menu: About Us → Certificates */}
      <div id="certificates" className="scroll-mt-24 border-t border-gray-100">
        <Advantages certificates={certificates} />
      </div>

      <FinanciersBlock financiers={financiers} />

      <section className="bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading eyebrow={labels.partners} title={t("partners.title")} description={t("partners.description")} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {partners?.map((partner, index) => (
              <div
                key={index}
                className="relative flex aspect-[3/2] items-center justify-center rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={partner.src || "/placeholder.svg"}
                    alt={partner.name || `MESMER Partner Brand ${index + 1}`}
                    fill
                    sizes="200px"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
