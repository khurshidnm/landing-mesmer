export interface ProjectStageOption {
  value: string;
  labelEn: string;
  labelUz: string;
  labelRu: string;
  en: string;
  uz: string;
  ru: string;
  matches: string[];
}

export const PROJECT_STAGES: ProjectStageOption[] = [
  {
    value: "Ongoing",
    labelEn: "Ongoing",
    labelUz: "Jarayonda (Ongoing)",
    labelRu: "В процессе (Ongoing)",
    en: "Ongoing",
    uz: "Jarayonda",
    ru: "В процессе",
    matches: ["ongoing", "jarayonda", "в процессе"],
  },
  {
    value: "Finished",
    labelEn: "Finished",
    labelUz: "Tamomlangan (Finished)",
    labelRu: "Завершено (Finished)",
    en: "Finished",
    uz: "Tamomlangan",
    ru: "Завершено",
    matches: ["finished", "completed", "tamomlangan", "завершено"],
  },
  {
    value: "Commisioning stage",
    labelEn: "Commisioning stage",
    labelUz: "Ishga tushirish bosqichida (Commisioning stage)",
    labelRu: "Этап ввода в эксплуатацию (Commisioning stage)",
    en: "Commisioning stage",
    uz: "Ishga tushirish bosqichida",
    ru: "Этап ввода в эксплуатацию",
    matches: [
      "commisioning stage",
      "commissioning stage",
      "commisioning",
      "commissioning",
      "ishga tushirish bosqichida",
      "этап ввода в эксплуатацию",
    ],
  },
];

export function getSelectedStageValue(currentValue?: string): string {
  if (!currentValue) return "";
  const lower = currentValue.trim().toLowerCase();
  const found = PROJECT_STAGES.find((stage) =>
    stage.matches.some((m) => m === lower)
  );
  return found ? found.value : currentValue;
}

export function getStageTranslations(stageValue: string) {
  const stage = PROJECT_STAGES.find((s) => s.value === stageValue);
  if (stage) {
    return {
      en: stage.en,
      uz: stage.uz,
      ru: stage.ru,
    };
  }
  return {
    en: stageValue,
    uz: stageValue,
    ru: stageValue,
  };
}

/**
 * Returns Tailwind CSS classes for status badge coloring.
 * - Ongoing     → blue
 * - Finished    → green
 * - Commisioning stage → amber/yellow
 */
export function getStatusColor(statusValue?: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  if (!statusValue) return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" };

  const normalized = getSelectedStageValue(statusValue);

  switch (normalized) {
    case "Ongoing":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" };
    case "Finished":
      return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" };
    case "Commisioning stage":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" };
  }
}

/**
 * Normalizes displayed status text: maps "Completed" variants to the
 * canonical "Finished" translation for the given locale.
 */
export function normalizeStatusDisplay(
  statusValue: string,
  locale: "en" | "uz" | "ru" = "en"
): string {
  const stageKey = getSelectedStageValue(statusValue);
  const stage = PROJECT_STAGES.find((s) => s.value === stageKey);
  if (stage) {
    return stage[locale];
  }
  return statusValue;
}
