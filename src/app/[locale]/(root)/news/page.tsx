"use client";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { Cards } from "../components/Cards";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IPagination } from "@/types";
import { getNews } from "@/app/admin/(admin)/(root)/news/server-action";

interface NewsItem {
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

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  limit: number;
}

const News = () => {
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
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchNews = async () => {
    try {
      const newsData = await getNews({
        page,
        limit,
        slug: null
      });
      const { news, pagination } = JSON.parse(newsData);
      setNews(news);
      setPagination(pagination);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  useEffect(() => {
    fetchNews()
  }, [page, limit])

  // Handle page change
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // For debugging
  console.log("Pagination data:", pagination);

  return (
    <div>
      <Hero
        backgroundImage="/news.png"
        height="500px"
        title={t("title")}
        subtitle=""
      />
      <div className="rounded-none mx-auto container py-16">
        <Cards news={news} />

        {/* Always show pagination for testing */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(pagination?.prev)}
            disabled={!pagination || pagination.page === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination?.pages || 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(pagination.next)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  page === i+1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(pagination?.next)}
            disabled={
              !pagination || pagination.page === pagination.page
            }
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default News;
