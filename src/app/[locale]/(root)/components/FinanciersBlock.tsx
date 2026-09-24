"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { t } from "@/lib/cms/definitions";
import type { FinancierEntry } from "@/lib/cms/content-types";

const TEXT = {
  en: {
    title: "Experience with Internationally Financed Projects",
    body: "MESMER has extensive experience delivering infrastructure projects financed by international financial institutions, working to their procurement, quality and safeguard requirements.",
  },
  ru: {
    title: "Опыт реализации проектов с международным финансированием",
    body: "MESMER обладает большим опытом реализации инфраструктурных проектов, финансируемых международными финансовыми институтами, в соответствии с их требованиями к закупкам, качеству и социальной и экологической защите.",
  },
  uz: {
    title: "Xalqaro moliyalashtirilgan loyihalar tajribasi",
    body: "MESMER xalqaro moliya institutlari tomonidan moliyalashtiriladigan infratuzilma loyihalarini ularning xarid, sifat va ekologik-ijtimoiy talablariga muvofiq amalga oshirishda katta tajribaga ega.",
  },
} as const;

// Financier logos (spec 4.6). Each logo opens the project database filtered by that financier.
export default function FinanciersBlock({ financiers }: { financiers: FinancierEntry[] }) {
  const locale = useLocale() as keyof typeof TEXT;
  const text = TEXT[locale] || TEXT.en;
  if (!financiers.length) return null;

  return (
    <section className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold tracking-wide sm:text-3xl">{text.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">{text.body}</p>
          </div>
          <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 2xl:grid-cols-3 lg:col-span-3">
            {financiers.map((f) => {
              const fullName = t(f.full_name, locale) || f.name;
              return (
                <li key={f._id}>
                  <Link
                    href={`/${locale}/projects?financier=${f.slug}`}
                    title={fullName}
                    className="flex h-24 flex-col items-center justify-center gap-1 rounded-lg bg-white px-5 text-center text-gray-900 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {f.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.logo} alt={fullName} className="max-h-14 w-auto max-w-full object-contain" />
                    ) : (
                      <>
                        <span className="text-lg font-extrabold tracking-wide text-blue-700">{f.name}</span>
                        <span className="line-clamp-2 text-[11px] leading-tight text-gray-500">{fullName}</span>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
