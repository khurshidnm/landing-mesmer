import { format } from "date-fns";
import { enGB, ru, uz } from "date-fns/locale";

export type NewsLocale = "en" | "ru" | "uz";

export const pickNewsLocale = (value: string): NewsLocale => (value === "ru" || value === "uz" ? value : "en");

const DATE_LOCALES = { en: enGB, ru, uz };

export function formatNewsDate(date: string | Date, locale: NewsLocale): string {
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? "" : format(value, "d MMMM yyyy", { locale: DATE_LOCALES[locale] });
}

export const NEWS_TEXT = {
  en: {
    title: "News",
    eyebrow: "Press centre",
    heading: "Company news",
    intro: "Project milestones, plant launches and company updates from MESMER.",
    readMore: "Read more",
    empty: "No news yet.",
    back: "All news",
    home: "Home",
    notFound: "This news article was not found.",
    more: "More news",
    share: "Share",
  },
  ru: {
    title: "Новости",
    eyebrow: "Пресс-центр",
    heading: "Новости компании",
    intro: "Этапы строительства, запуск объектов и события компании MESMER.",
    readMore: "Читать далее",
    empty: "Новостей пока нет.",
    back: "Все новости",
    home: "Главная",
    notFound: "Новость не найдена.",
    more: "Другие новости",
    share: "Поделиться",
  },
  uz: {
    title: "Yangiliklar",
    eyebrow: "Matbuot markazi",
    heading: "Kompaniya yangiliklari",
    intro: "MESMER kompaniyasining qurilish bosqichlari, inshootlar ishga tushirilishi va voqealari.",
    readMore: "Batafsil",
    empty: "Hozircha yangiliklar yo‘q.",
    back: "Barcha yangiliklar",
    home: "Bosh sahifa",
    notFound: "Yangilik topilmadi.",
    more: "Boshqa yangiliklar",
    share: "Ulashish",
  },
} as const;
