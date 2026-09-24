export interface ProjectTypeOption {
  value: string;
  labelEn: string;
  labelUz: string;
  labelRu: string;
}

export const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    value: "wwtp",
    labelEn: "WWTP EPC (Wastewater)",
    labelUz: "WWTP EPC (Oqova suv)",
    labelRu: "WWTP EPC (Очистные сооружения)",
  },
  {
    value: "wtp",
    labelEn: "WTP (Water Treatment)",
    labelUz: "WTP (Suv tozalash)",
    labelRu: "WTP (Водоочистные станции)",
  },
  {
    value: "adb",
    labelEn: "ADB Water Projects",
    labelUz: "OTB suv loyihalari",
    labelRu: "Проекты АБР",
  },
  {
    value: "ebrd",
    labelEn: "EBRD Water Projects",
    labelUz: "EBRD suv loyihalari",
    labelRu: "Проекты ЕБРР",
  },
];

export function getProjectTypeLabel(
  value: string,
  locale: "en" | "uz" | "ru" = "en"
): string {
  const type = PROJECT_TYPES.find((t) => t.value === value);
  if (!type) return value;
  if (locale === "uz") return type.labelUz;
  if (locale === "ru") return type.labelRu;
  return type.labelEn;
}
