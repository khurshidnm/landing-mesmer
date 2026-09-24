"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import StatValue from "./StatValue";
import { t } from "@/lib/cms/definitions";
import type { StatEntry } from "@/lib/cms/content-types";

const HEADING = { en: "MESMER in Numbers", ru: "MESMER в цифрах", uz: "MESMER raqamlarda" } as const;

// "MESMER in Numbers" (spec 4.3): tiles from Website Content → Key Numbers.
export default function CompanyNumbers({ stats }: { stats: StatEntry[] }) {
  const locale = useLocale() as keyof typeof HEADING;
  if (!stats.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-3xl font-extrabold tracking-wide text-gray-900 sm:mb-10 sm:text-4xl">
        {HEADING[locale] || HEADING.en}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-4xl font-bold text-blue-600 md:text-5xl">
              <StatValue value={stat.value} unitClassName="text-2xl md:text-3xl" />
            </p>
            <p className="mt-2 text-sm text-gray-600">{t(stat.description, locale) || t(stat.label, locale)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
