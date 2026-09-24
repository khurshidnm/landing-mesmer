// Formatting for the structured project fields on public pages.

import { CONTRACT_TYPES, PROJECT_CATEGORIES, PROJECT_STATUSES, optionLabel } from "@/lib/cms/definitions";

type Locale = "en" | "ru" | "uz";

export const LABELS = {
  en: { location: "Location", client: "Client", financier: "Financier", contract: "Contract type", capacity: "Capacity", population: "Population served", period: "Period", now: "present", people: "people" },
  ru: { location: "Местоположение", client: "Заказчик", financier: "Финансирование", contract: "Тип контракта", capacity: "Мощность", population: "Охват населения", period: "Период", now: "н.в.", people: "чел." },
  uz: { location: "Joylashuv", client: "Buyurtmachi", financier: "Moliyalashtirish", contract: "Shartnoma turi", capacity: "Quvvat", population: "Aholi qamrovi", period: "Muddat", now: "hozirgacha", people: "kishi" },
} as const;

export const labels = (locale: string) => LABELS[(locale as Locale) in LABELS ? (locale as Locale) : "en"];

export function countryName(code: string | undefined, locale: string) {
  if (!code) return "";
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

export const categoryLabel = (value: string | undefined, locale: string) => optionLabel(PROJECT_CATEGORIES, value, locale);
export const contractLabel = (value: string | undefined, locale: string) => optionLabel(CONTRACT_TYPES, value, locale);
export const statusLabel = (value: string | undefined, locale: string) => optionLabel(PROJECT_STATUSES, value, locale);

const number = (n: number, locale: string) => new Intl.NumberFormat(locale === "uz" ? "ru" : locale).format(n);

const DEFAULT_UNIT = { en: "m³/day", ru: "м³/сут", uz: "m³/kun" } as const;

export const formatCapacity = (value: number | null | undefined, unit: string | undefined, locale: string) => {
  if (!value) return "";
  const shown = !unit || unit === "m³/day" ? DEFAULT_UNIT[(locale as Locale) in DEFAULT_UNIT ? (locale as Locale) : "en"] : unit;
  return `${number(value, locale)} ${shown}`;
};

export const formatPopulation = (value: number | null | undefined, locale: string) =>
  value ? `${number(value, locale)} ${labels(locale).people}` : "";

/** "2019 – 2021", or "2025 – present" while ongoing. */
export function formatPeriod(start: string | undefined, end: string | undefined, locale: string) {
  const year = (d?: string) => d?.slice(0, 4) || "";
  if (!start && !end) return "";
  if (!end) return `${year(start)} – ${labels(locale).now}`;
  return year(start) === year(end) ? year(end) : `${year(start)} – ${year(end)}`;
}

export const STATUS_STYLE: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-50 text-blue-700 border-blue-200",
  commissioning: "bg-amber-50 text-amber-800 border-amber-200",
};
