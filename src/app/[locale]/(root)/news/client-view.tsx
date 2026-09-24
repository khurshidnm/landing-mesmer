"use client";

import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { Cards } from "../components/Cards";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { IPagination } from "@/types";
import { getNews } from "@/app/admin/(admin)/(root)/news/server-action";

export interface NewsItem {
  _id: string;
  uz: {
    title: string;
    description: string;
    content: string;
  };
  en: {
    title: string;
    description: string;
    content: string;
  };
  ru: {
    title: string;
    description: string;
    content: string;
  };
  createdAt: Date;
  cover: string;
  slug: string;
}

export default function NewsClientView() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    next: 0,
    prev: 0,
  });
  const t = useTranslations("news");
  const locale = useLocale();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchNews = async () => {
    try {
      const newsData = await getNews({
        page,
        limit,
        slug: null,
      });
      const { news, pagination } = JSON.parse(newsData);
      setNews(news);
      setPagination(pagination);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, limit]);

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  return (
    <div className="bg-white">
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `https://www.mesmer.uz/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "News",
                item: `https://www.mesmer.uz/${locale}/news`,
              },
            ],
          }),
        }}
      />

      <Hero
        backgroundImage="/news.png"
        height="500px"
        title={t("title")}
        subtitle=""
        headingTag="h1"
      />
      <div className="rounded-none mx-auto container py-16 px-4">
        <Cards news={news} />

        {pagination?.pages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(pagination?.prev)}
              disabled={!pagination || pagination.page === 1}
              className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination?.pages || 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors font-medium text-sm ${
                    page === i + 1
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : "hover:bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination?.next)}
              disabled={!pagination || pagination.page === pagination.pages}
              className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
