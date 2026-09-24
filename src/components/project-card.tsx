import Link from "next/link";
import Image from "@/components/BluredImage";
import {
  STATUS_STYLE,
  categoryLabel,
  contractLabel,
  countryName,
  formatCapacity,
  formatPeriod,
  labels,
  statusLabel,
} from "@/lib/project-display";

export type ProjectCardData = {
  _id: string;
  slug: string;
  cover?: string;
  category?: string;
  country?: string;
  financier?: string;
  contract_type?: string;
  stage?: string;
  capacity_value?: number | null;
  capacity_unit?: string;
  start_date?: string;
  end_date?: string;
  uz: { title: string; customer?: string; city?: string };
  ru: { title: string; customer?: string; city?: string };
  en: { title: string; customer?: string; city?: string };
};

/** Project database card (spec 4.5): photo, location, client, financier, contract, capacity, status, years. */
export default function ProjectCard({
  project,
  locale,
  financierName,
}: {
  project: ProjectCardData;
  locale: "en" | "ru" | "uz";
  financierName?: string;
}) {
  const loc = project[locale] || project.en;
  const text = labels(locale);
  const location = [loc.city, countryName(project.country, locale)].filter(Boolean).join(", ");
  const facts = [
    { label: text.location, value: location },
    { label: text.client, value: loc.customer },
    { label: text.financier, value: financierName },
    { label: text.contract, value: contractLabel(project.contract_type, locale) },
    { label: text.capacity, value: formatCapacity(project.capacity_value, project.capacity_unit, locale) },
  ].filter((f) => f.value);

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={project.cover || "/placeholder.svg"}
          alt={`${loc.title} — ${categoryLabel(project.category, "en") || "Water infrastructure"} project, MESMER`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {project.stage && (
            <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[project.stage] || ""}`}>
              {statusLabel(project.stage, locale)}
            </span>
          )}
          {project.category && (
            <span className="rounded-md border border-gray-200 bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
              {categoryLabel(project.category, locale)}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-3 text-base font-bold leading-snug text-gray-950 transition-colors group-hover:text-blue-600">
          {loc.title}
        </h3>
        <dl className="mt-4 space-y-1.5 text-sm">
          {facts.map((fact) => (
            <div key={fact.label} className="flex gap-2">
              <dt className="w-28 shrink-0 text-gray-500">{fact.label}</dt>
              <dd className="line-clamp-2 font-medium text-gray-800">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {formatPeriod(project.start_date, project.end_date, locale) && (
          <p className="mt-auto border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
            {formatPeriod(project.start_date, project.end_date, locale)}
          </p>
        )}
      </div>
    </Link>
  );
}
