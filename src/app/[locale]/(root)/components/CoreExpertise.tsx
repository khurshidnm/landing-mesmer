"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { t, tList } from "@/lib/cms/definitions";
import type { ExpertiseEntry } from "@/lib/cms/content-types";

const TEXT = {
  en: { eyebrow: "What we do", title: "Our Core Expertise", all: "All expertise" },
  ru: { eyebrow: "Чем мы занимаемся", title: "Наша ключевая экспертиза", all: "Вся экспертиза" },
  uz: { eyebrow: "Faoliyatimiz", title: "Asosiy yo‘nalishlarimiz", all: "Barcha yo‘nalishlar" },
} as const;

// Expertise cards (spec 4.4). Used on the home page and on /expertise.
export default function CoreExpertise({
  items,
  showHeading = true,
  showAllLink = true,
}: {
  items: ExpertiseEntry[];
  showHeading?: boolean;
  showAllLink?: boolean;
}) {
  const locale = useLocale() as keyof typeof TEXT;
  const text = TEXT[locale] || TEXT.en;
  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {showHeading && (
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{text.eyebrow}</span>
            <h2 className="text-3xl font-extrabold tracking-wide text-gray-900 sm:text-4xl">{text.title}</h2>
          </div>
          {showAllLink && (
            <Link href={`/${locale}/expertise`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              {text.all} →
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((item, index) => (
          <motion.div
            key={item._id}
            id={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
            className="scroll-mt-28"
          >
            <Link
              href={`/${locale}/expertise/${item.slug}`}
              className="group flex h-full flex-col rounded-lg border border-gray-200 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-950 transition-colors group-hover:text-blue-600">
                  {t(item.title, locale)}
                </h3>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-blue-600" />
              </div>
              {t(item.summary, locale) && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t(item.summary, locale)}</p>
              )}
              {tList(item.services, locale).length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {tList(item.services, locale).map((service) => (
                    <li key={service} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {service}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
