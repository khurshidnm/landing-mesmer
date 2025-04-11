"use client";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { Cards } from "../components/Cards";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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

const News = ({
  news,
  pagination,
}: {
  news: NewsItem[];
  pagination: PaginationProps;
}) => {
  const t = useTranslations("news");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
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
            onClick={() => handlePageChange(pagination?.currentPage - 1 || 1)}
            disabled={!pagination || pagination.currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  pagination?.currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(pagination?.currentPage + 1 || 2)}
            disabled={
              !pagination || pagination.currentPage === pagination.totalPages
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
