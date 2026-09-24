"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALL_COUNTRIES } from "@/lib/countries";
import { CONTRACT_TYPES, PROJECT_CATEGORIES, t, type CmsEntry, type I18nText } from "@/lib/cms/definitions";

export interface ProjectDatabaseValues {
  category: string;
  contract_type: string;
  financier: string;
  country: string;
  city_uz: string;
  city_ru: string;
  city_en: string;
  capacity_value: string;
  capacity_unit: string;
  population_served: string;
  start_date: string;
  end_date: string;
}

export const EMPTY_PROJECT_DATABASE: ProjectDatabaseValues = {
  category: "",
  contract_type: "",
  financier: "",
  country: "UZ",
  city_uz: "",
  city_ru: "",
  city_en: "",
  capacity_value: "",
  capacity_unit: "m³/day",
  population_served: "",
  start_date: "",
  end_date: "",
};

type ProjectLike = {
  category?: string;
  contract_type?: string;
  financier?: string;
  country?: string;
  capacity_value?: number | null;
  capacity_unit?: string;
  population_served?: number | null;
  start_date?: string;
  end_date?: string;
  uz?: { city?: string };
  ru?: { city?: string };
  en?: { city?: string };
};

/** Form values from a stored project. */
export function projectDatabaseValues(project: ProjectLike): ProjectDatabaseValues {
  return {
    category: project.category || "",
    contract_type: project.contract_type || "",
    financier: project.financier || "",
    country: project.country || "UZ",
    city_uz: project.uz?.city || "",
    city_ru: project.ru?.city || "",
    city_en: project.en?.city || "",
    capacity_value: project.capacity_value != null ? String(project.capacity_value) : "",
    capacity_unit: project.capacity_unit || "m³/day",
    population_served: project.population_served != null ? String(project.population_served) : "",
    start_date: project.start_date || "",
    end_date: project.end_date || "",
  };
}

const selectClass =
  "w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50";

/** "Project database" fields (spec 4.5) shared by the create and edit forms. */
export function ProjectDatabaseFields({
  values,
  onChange,
  disabled,
}: {
  values: ProjectDatabaseValues;
  onChange: (values: ProjectDatabaseValues) => void;
  disabled?: boolean;
}) {
  const [financiers, setFinanciers] = useState<CmsEntry<{ slug: string; name: string; full_name: I18nText }>[]>([]);

  useEffect(() => {
    axios
      .get("/api/cms/financiers")
      .then((res) => setFinanciers(res.data.data.entries))
      .catch(() => setFinanciers([]));
  }, []);

  const set = (name: keyof ProjectDatabaseValues, value: string) => onChange({ ...values, [name]: value });
  const dateHint = "YYYY or YYYY-MM";

  return (
    <div className="space-y-4 rounded-lg border bg-gray-50/60 p-4">
      <div>
        <h3 className="font-semibold text-gray-900">Project database</h3>
        <p className="text-xs text-muted-foreground">
          Used for the filters and cards on the Projects page. Status comes from “Project Stage / Status” above.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <select className={selectClass} disabled={disabled} value={values.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">-- Select category --</option>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.en}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Contract type</Label>
          <select className={selectClass} disabled={disabled} value={values.contract_type} onChange={(e) => set("contract_type", e.target.value)}>
            <option value="">— Not specified —</option>
            {CONTRACT_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.en}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Financier</Label>
          <select className={selectClass} disabled={disabled} value={values.financier} onChange={(e) => set("financier", e.target.value)}>
            <option value="">— None / state budget —</option>
            {financiers.map((f) => (
              <option key={f._id} value={f.slug}>
                {f.name} — {t(f.full_name, "en")}
              </option>
            ))}
            {values.financier && !financiers.some((f) => f.slug === values.financier) && (
              <option value={values.financier}>{values.financier}</option>
            )}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Country</Label>
          <select className={selectClass} disabled={disabled} value={values.country} onChange={(e) => set("country", e.target.value)}>
            {ALL_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {(["uz", "ru", "en"] as const).map((lang) => (
          <div key={lang} className="space-y-1.5">
            <Label>City ({lang.toUpperCase()})</Label>
            <Input disabled={disabled} value={values[`city_${lang}`]} onChange={(e) => set(`city_${lang}`, e.target.value)} />
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Capacity</Label>
          <Input
            disabled={disabled}
            inputMode="decimal"
            placeholder="e.g. 60000"
            value={values.capacity_value}
            onChange={(e) => set("capacity_value", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Capacity unit</Label>
          <Input disabled={disabled} value={values.capacity_unit} onChange={(e) => set("capacity_unit", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Population served</Label>
          <Input
            disabled={disabled}
            inputMode="numeric"
            placeholder="e.g. 250000"
            value={values.population_served}
            onChange={(e) => set("population_served", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label>Start</Label>
            <Input disabled={disabled} placeholder={dateHint} value={values.start_date} onChange={(e) => set("start_date", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>End</Label>
            <Input disabled={disabled} placeholder="empty = ongoing" value={values.end_date} onChange={(e) => set("end_date", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
