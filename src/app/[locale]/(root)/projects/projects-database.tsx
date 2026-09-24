import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import FinanciersBlock from "../components/FinanciersBlock";
import ProjectCard, { type ProjectCardData } from "@/components/project-card";
import { getEntries } from "@/lib/cms/server";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/cms/definitions";
import { serialize, type FinancierEntry } from "@/lib/cms/content-types";
import { countryName } from "@/lib/project-display";
import {
  FILTER_KEYS,
  filtersToSearch,
  parseFilters,
  queryProjects,
  type FilterKey,
  type ProjectFilters,
} from "@/lib/projects-query";

type Locale = "en" | "ru" | "uz";

const TEXT = {
  en: {
    heroSubtitle: "Our projects",
    heroTitle: "Water & Wastewater Infrastructure EPC Projects in Uzbekistan & Central Asia",
    eyebrow: "Project database",
    heading: "Current and completed projects",
    intro: "Filter the portfolio by service, country, financier and status. Share the page link to share your selection.",
    groups: { category: "Service", country: "Country", financier: "Financier", status: "Status" },
    all: "All",
    clear: "Clear filters",
    found: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
    empty: "No projects match these filters.",
    calloutEyebrow: "General Contracting & Inquiries",
    calloutTitle: "Looking for an EPC Contractor for Water & Wastewater Projects?",
    calloutText:
      "MESMER provides turnkey engineering, equipment procurement, construction, and O&M for WWTP, WTP, and water infrastructure under FIDIC standards.",
    calloutCta: "Explore our expertise",
  },
  ru: {
    heroSubtitle: "Наши проекты",
    heroTitle: "Проекты ВОС, КОС и водной инфраструктуры в Узбекистане и Центральной Азии",
    eyebrow: "База проектов",
    heading: "Текущие и завершённые проекты",
    intro: "Отфильтруйте портфолио по направлению, стране, источнику финансирования и статусу. Ссылка на страницу сохраняет выбранные фильтры.",
    groups: { category: "Направление", country: "Страна", financier: "Финансирование", status: "Статус" },
    all: "Все",
    clear: "Сбросить фильтры",
    found: (n: number) => `Проектов: ${n}`,
    empty: "Нет проектов, соответствующих фильтрам.",
    calloutEyebrow: "Генеральный подряд и запросы",
    calloutTitle: "Ищете надежного EPC-подрядчика для объектов водоочистки?",
    calloutText: "MESMER осуществляет полный комплекс работ по проектированию, поставке и строительству КОС/ВОС по стандартам FIDIC.",
    calloutCta: "Наша экспертиза",
  },
  uz: {
    heroSubtitle: "Loyihalarimiz",
    heroTitle: "O'zbekiston va Markaziy Osiyoda suv va oqova suv infratuzilmasi EPC loyihalari",
    eyebrow: "Loyihalar bazasi",
    heading: "Joriy va tugallangan loyihalar",
    intro: "Portfelni yo‘nalish, davlat, moliyalashtirish manbai va holat bo‘yicha saralang. Sahifa havolasi tanlangan filtrlarni saqlaydi.",
    groups: { category: "Yo‘nalish", country: "Davlat", financier: "Moliyalashtirish", status: "Holat" },
    all: "Barchasi",
    clear: "Filtrlarni tozalash",
    found: (n: number) => `Loyihalar: ${n}`,
    empty: "Filtrlarga mos loyiha topilmadi.",
    calloutEyebrow: "Bosh pudrat va hamkorlik",
    calloutTitle: "Suv va oqova suv loyihalari uchun ishonchli EPC pudratchi izlayapsizmi?",
    calloutText: "MESMER FIDIC standartlari asosida WTP va WWTP inshootlarini to'liq kalit ostida qurish va ekspluatatsiya qilishni ta'minlaydi.",
    calloutCta: "Yo‘nalishlarimiz",
  },
} as const;

function toggle(filters: ProjectFilters, key: FilterKey, value: string): ProjectFilters {
  const current = filters[key];
  return {
    ...filters,
    [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
  };
}

export default async function ProjectsDatabase({
  locale: rawLocale,
  searchParams,
}: {
  locale: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale: Locale = rawLocale === "ru" || rawLocale === "uz" ? rawLocale : "en";
  const text = TEXT[locale];
  const filters = parseFilters(searchParams);
  const page = Math.max(1, parseInt(String(searchParams.page || "1"), 10) || 1);

  const [{ projects, total, pages, facets }, financierEntries] = await Promise.all([
    queryProjects(filters, page),
    getEntries("financiers"),
  ]);
  const financiers = serialize(financierEntries) as FinancierEntry[];
  const financierName = (slug?: string) => financiers.find((f) => f.slug === slug)?.name || "";

  const base = `/${locale}/projects`;
  const count = (key: FilterKey, value: string) => facets[key].find((f) => f.value === value)?.count || 0;

  // Options per filter: known lists first, then any other values found in the data
  const options: Record<FilterKey, { value: string; label: string }[]> = {
    category: PROJECT_CATEGORIES.map((c) => ({ value: c.value, label: c[locale] })),
    country: facets.country
      .map((f) => ({ value: f.value, label: countryName(f.value, locale) }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    financier: financiers.map((f) => ({ value: f.slug, label: f.name })),
    status: PROJECT_STATUSES.map((s) => ({ value: s.value, label: s[locale] })),
  };
  const hasFilters = FILTER_KEYS.some((key) => filters[key].length);

  return (
    <>
      <Hero backgroundImage="/projects.png" title={text.heroTitle} subtitle={text.heroSubtitle} height="500px" headingTag="h1" />

      <div className="container mx-auto w-full px-4 py-12 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-gray-100 pb-8 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{text.eyebrow}</span>
            <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">{text.heading}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-600">{text.intro}</p>
        </div>

        {/* Filter panel: every option is a link, so a filtered view has its own shareable URL */}
        <div className="mb-8 space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
          {FILTER_KEYS.map((key) => {
            const visible = options[key].filter((o) => count(key, o.value) > 0 || filters[key].includes(o.value));
            if (!visible.length) return null;
            return (
              <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <span className="w-36 shrink-0 pt-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {text.groups[key]}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={base + filtersToSearch({ ...filters, [key]: [] })}
                    scroll={false}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                      filters[key].length === 0
                        ? "border-blue-600 bg-blue-600 font-semibold text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {text.all}
                  </Link>
                  {visible.map((option) => {
                    const active = filters[key].includes(option.value);
                    return (
                      <Link
                        key={option.value}
                        href={base + filtersToSearch(toggle(filters, key, option.value))}
                        scroll={false}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                          active
                            ? "border-blue-600 bg-blue-600 font-semibold text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                        <span
                          className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold ${
                            active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {count(key, option.value)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-700">{text.found(total)}</p>
          {hasFilters && (
            <Link href={base} scroll={false} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              <X className="h-4 w-4" /> {text.clear}
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">{text.empty}</p>
        ) : (
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(projects as ProjectCardData[]).map((project) => (
              <ProjectCard key={project._id} project={project} locale={locale} financierName={financierName(project.financier)} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="mb-16 flex items-center justify-center gap-4" aria-label="Pagination">
            <Link
              href={base + filtersToSearch(filters, Math.max(1, page - 1))}
              aria-disabled={page === 1}
              className={`rounded-full border border-gray-200 p-3 transition-colors hover:bg-gray-100 ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={base + filtersToSearch(filters, n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    n === page ? "bg-blue-600 font-bold text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </Link>
              ))}
            </div>
            <Link
              href={base + filtersToSearch(filters, Math.min(pages, page + 1))}
              aria-disabled={page === pages}
              className={`rounded-full border border-gray-200 p-3 transition-colors hover:bg-gray-100 ${page === pages ? "pointer-events-none opacity-40" : ""}`}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </nav>
        )}
      </div>

      <FinanciersBlock financiers={financiers} />

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <section className="flex flex-col items-center justify-between gap-6 rounded-lg border border-gray-200 bg-gray-50 p-8 text-gray-950 md:flex-row">
          <div className="space-y-2">
            <span className="mb-1 block text-sm font-semibold uppercase tracking-wider text-blue-600">{text.calloutEyebrow}</span>
            <h3 className="text-xl font-bold">{text.calloutTitle}</h3>
            <p className="max-w-xl text-sm text-gray-600">{text.calloutText}</p>
          </div>
          <Link
            href={`/${locale}/expertise`}
            className="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {text.calloutCta} &rarr;
          </Link>
        </section>
      </div>
      <Footer />
    </>
  );
}

