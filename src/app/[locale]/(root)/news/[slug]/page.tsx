import React from "react";
import type { Metadata } from "next";
import NewsArticle from "./page-view";
import { pickNewsLocale } from "@/lib/news-display";
import { getNews } from "@/app/admin/(admin)/(root)/news/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { NewsItem } from "@/types/news";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const newsData = await getNews({
    page: 1,
    limit: 1,
    slug,
  });

  const news = parseServerActionJson<NewsItem | null>(newsData, null);
  const loc = (locale || "en") as "uz" | "ru" | "en";
  const localized = news?.[loc] || news?.en || news?.ru;

  const title = localized?.title
    ? `${localized.title} | MESMER News`
    : "MESMER News & Water Infrastructure Updates";
  const description =
    localized?.description ||
    "Read the latest news and infrastructure construction updates from MESMER, premier water treatment and wastewater EPC contractor in Uzbekistan.";

  const canonicalUrl = `https://www.mesmer.uz/${loc}/news/${slug}`;
  const ogImage = news?.cover
    ? news.cover.startsWith("http")
      ? news.cover
      : `https://www.mesmer.uz${news.cover}`
    : "https://www.mesmer.uz/banner.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://www.mesmer.uz/en/news/${slug}`,
        ru: `https://www.mesmer.uz/ru/news/${slug}`,
        uz: `https://www.mesmer.uz/uz/news/${slug}`,
        "x-default": `https://www.mesmer.uz/en/news/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "MESMER",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const page = async (props: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const params = await props.params;
  const [newsData, latestData] = await Promise.all([
    getNews({ page: 1, limit: 1, slug: params.slug }),
    getNews({ page: 1, limit: 4 }),
  ]);

  const news = parseServerActionJson<NewsItem | null>(newsData, null);
  const latest = parseServerActionJson<{ news?: NewsItem[] }>(latestData, {}).news || [];
  const related = latest.filter((item) => item.slug !== params.slug).slice(0, 3);

  return <NewsArticle news={news} related={related} locale={pickNewsLocale(params.locale)} />;
};

export default page;
