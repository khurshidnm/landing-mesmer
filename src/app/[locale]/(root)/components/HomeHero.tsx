"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "@/components/BluredImage";
import Navbar from "./Navbar";
import StatValue from "./StatValue";
import { localizeHref, t } from "@/lib/cms/definitions";
import type { HeroContent, StatEntry } from "@/lib/cms/content-types";

// Home first screen (spec 4.2): brand + EPCO line, headline, short text,
// two buttons and a strip of key numbers. All texts come from Website Content.
export default function HomeHero({ hero, stats }: { hero: HeroContent; stats: StatEntry[] }) {
  const locale = useLocale();
  const strip = stats.filter((s) => s.show_in_hero).slice(0, 4);
  const title = t(hero.title, locale);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gray-950">
      <div className="absolute inset-0">
        <Image
          src={hero.background || "/hero.png"}
          alt={title || "MESMER Water Treatment & Wastewater EPC Contractor"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      <Navbar />

      <div className="container relative z-10 mx-auto flex flex-1 flex-col justify-end px-4 pb-10 pt-32 md:pb-14">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-4xl text-white"
        >
          {hero.brand && <p className="text-sm font-bold uppercase tracking-[0.25em] text-white">{hero.brand}</p>}
          {t(hero.tagline, locale) && (
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-blue-200 sm:text-sm">
              {t(hero.tagline, locale)}
            </p>
          )}
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">{title}</h1>
          {t(hero.subtitle, locale) && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {t(hero.subtitle, locale)}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {t(hero.primary_label, locale) && (
              <Link
                href={localizeHref(hero.primary_href || "/projects", locale)}
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-blue-700"
              >
                {t(hero.primary_label, locale)}
              </Link>
            )}
            {t(hero.secondary_label, locale) && (
              <Link
                href={localizeHref(hero.secondary_href || "/contact", locale)}
                className="inline-flex items-center rounded-lg border border-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
              >
                {t(hero.secondary_label, locale)}
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {strip.length > 0 && (
        <div className="relative z-10 border-t border-white/15 bg-black/45 backdrop-blur-sm">
          <dl className="container mx-auto grid grid-cols-2 px-4 md:grid-cols-4">
            {strip.map((stat, i) => (
              <div
                key={stat._id}
                className={`py-5 text-white md:px-6 md:first:pl-0 ${i % 2 ? "border-l border-white/15 pl-4" : ""} ${
                  i > 0 ? "md:border-l md:border-white/15" : ""
                }`}
              >
                <dt className="sr-only">{t(stat.label, locale)}</dt>
                <dd>
                  <span className="block text-2xl font-bold sm:text-3xl">
                    <StatValue value={stat.value} />
                  </span>
                  <span className="text-xs uppercase tracking-wider text-white/70 sm:text-sm">{t(stat.label, locale)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
