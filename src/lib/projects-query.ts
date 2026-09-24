// Project database queries (spec 4.5): filters from the URL, facet counts, pagination.

import Projects from "@/database/projects.model";
import { connectToDatabase } from "@/lib/mongoose";

export const FILTER_KEYS = ["category", "country", "financier", "status"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type ProjectFilters = Record<FilterKey, string[]>;

// Database field behind each URL parameter
const FIELD: Record<FilterKey, string> = {
  category: "category",
  country: "country",
  financier: "financier",
  status: "stage",
};

// Links from before the project database (e.g. ?type=wwtp)
const LEGACY_TYPE: Record<string, Partial<ProjectFilters>> = {
  wwtp: { category: ["wastewater"] },
  wtp: { category: ["water-treatment"] },
  adb: { financier: ["adb"] },
  ebrd: { financier: ["ebrd"] },
};

type Params = Record<string, string | string[] | undefined>;

const list = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value : value ? [value] : [])
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter((v) => /^[A-Za-z0-9-]{1,40}$/.test(v));

/** Filters from the query string. Multiple values: ?category=wastewater,water-supply */
export function parseFilters(params: Params): ProjectFilters {
  const filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, list(params[key])])) as ProjectFilters;
  filters.country = filters.country.map((c) => c.toUpperCase());
  const legacy = LEGACY_TYPE[String(params.type || "")];
  if (legacy) {
    for (const key of FILTER_KEYS) {
      if (legacy[key] && !filters[key].length) filters[key] = legacy[key]!;
    }
  }
  return filters;
}

/** Options within one filter are OR-ed; different filters are AND-ed. */
function mongoQuery(filters: ProjectFilters, except?: FilterKey) {
  const query: Record<string, unknown> = {};
  for (const key of FILTER_KEYS) {
    if (key !== except && filters[key].length) query[FIELD[key]] = { $in: filters[key] };
  }
  return query;
}

export type Facets = Record<FilterKey, { value: string; count: number }[]>;

export async function queryProjects(filters: ProjectFilters, page: number, limit = 10) {
  await connectToDatabase();
  const query = mongoQuery(filters);
  const [projects, total, facetSource] = await Promise.all([
    Projects.find(query)
      .sort({ start_date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Projects.countDocuments(query),
    Projects.find({}, { category: 1, country: 1, financier: 1, stage: 1 }).lean<Record<string, string>[]>(),
  ]);

  // Each option counts projects matching the other active filters
  const facets = Object.fromEntries(
    FILTER_KEYS.map((key) => {
      const others = FILTER_KEYS.filter((k) => k !== key && filters[k].length);
      const counts = new Map<string, number>();
      for (const p of facetSource) {
        if (!others.every((k) => filters[k].includes(p[FIELD[k]]))) continue;
        const value = p[FIELD[key]];
        if (value) counts.set(value, (counts.get(value) || 0) + 1);
      }
      return [key, [...counts].map(([value, count]) => ({ value, count }))];
    })
  ) as Facets;

  return {
    projects: JSON.parse(JSON.stringify(projects)),
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
    facets,
  };
}

/** Query string for a filter state (used by filter chips and pagination links). */
export function filtersToSearch(filters: ProjectFilters, page = 1): string {
  const parts = FILTER_KEYS.filter((key) => filters[key].length).map(
    (key) => `${key}=${filters[key].map(encodeURIComponent).join(",")}`
  );
  if (page > 1) parts.push(`page=${page}`);
  return parts.length ? `?${parts.join("&")}` : "";
}
