import type { Metadata } from "next";

const BASE = "https://www.mesmer.uz";

/** Title, description, canonical and hreflang links for a localized page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = "/hero.png",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const url = `${BASE}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE}/en${path}`,
        ru: `${BASE}/ru${path}`,
        uz: `${BASE}/uz${path}`,
        "x-default": `${BASE}/en${path}`,
      },
    },
    openGraph: { title, description, url, type: "website", images: [{ url: image.startsWith("http") ? image : `${BASE}${image}` }] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export type PageLocale = "en" | "ru" | "uz";
export const pickLocale = (locale: string): PageLocale =>
  locale === "ru" || locale === "uz" ? locale : "en";
