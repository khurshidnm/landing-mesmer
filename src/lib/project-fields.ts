// Structured project fields (spec 4.5): validation shared by the project APIs.

import { CONTRACT_TYPES, PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/cms/definitions";
import { getSelectedStageValue } from "@/lib/project-status";

export interface ProjectStructured {
  country: string;
  financier: string;
  contract_type: string;
  category: string;
  stage: string;
  capacity_value: number | null;
  capacity_unit: string;
  population_served: number | null;
  start_date: string;
  end_date: string;
}

const pick = (value: unknown, list: readonly { value: string }[]) =>
  typeof value === "string" && list.some((o) => o.value === value) ? value : "";

const num = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(String(value).replace(/[\s,]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const date = (value: unknown) =>
  typeof value === "string" && /^\d{4}(-(0[1-9]|1[0-2]))?$/.test(value.trim()) ? value.trim() : "";

/** Maps the existing status text ("Finished", "Ongoing", ...) to a status key. */
export function stageFromStatus(status?: string): string {
  const value = getSelectedStageValue(status || "");
  if (value === "Finished") return "completed";
  if (value === "Ongoing") return "ongoing";
  if (value === "Commisioning stage") return "commissioning";
  return "";
}

/** Structured fields from a request body; unknown or malformed values are dropped. */
export function sanitizeProjectStructured(body: Record<string, unknown>): ProjectStructured {
  return {
    country:
      typeof body.country === "string" && /^[A-Z]{2}$/.test(body.country.trim().toUpperCase())
        ? body.country.trim().toUpperCase()
        : "UZ",
    financier:
      typeof body.financier === "string" ? body.financier.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") : "",
    contract_type: pick(body.contract_type, CONTRACT_TYPES),
    category: pick(body.category, PROJECT_CATEGORIES),
    stage: pick(body.stage, PROJECT_STATUSES) || stageFromStatus(body.status_en as string),
    capacity_value: num(body.capacity_value),
    capacity_unit: typeof body.capacity_unit === "string" && body.capacity_unit.trim() ? body.capacity_unit.trim().slice(0, 30) : "m³/day",
    population_served: num(body.population_served),
    start_date: date(body.start_date),
    end_date: date(body.end_date),
  };
}

export const cityFields = (body: Record<string, unknown>) => ({
  uz: typeof body.city_uz === "string" ? body.city_uz.trim().slice(0, 200) : "",
  en: typeof body.city_en === "string" ? body.city_en.trim().slice(0, 200) : "",
  ru: typeof body.city_ru === "string" ? body.city_ru.trim().slice(0, 200) : "",
});
