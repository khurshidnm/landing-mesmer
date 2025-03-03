"use client";

import { useState, useMemo } from "react";
import Image from "@/components/BluredImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "next-intl";

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

export function Cards({ news }: { news: NewsItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const locale = useLocale() as "uz" | "ru" | "en";

  // Сортируем новости по дате создания (от новых к старым)
  const sortedNews = useMemo(() => {
    return [...news].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [news]);

  const featuredNews = sortedNews[0];
  const otherNews = sortedNews.slice(1);

  return (
    <div className="w-full">
      <div className="w-full md:w-1/2 md:ml-auto mb-6">
        {featuredNews && (
          <motion.div
            key={featuredNews._id}
            className="md:col-span-3 md:col-start-3 order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setHoveredId(featuredNews._id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <Link href={`/${locale}/news/${featuredNews.slug}`}>
              <Card className="overflow-hidden h-full rounded-none transition-all duration-300 ">
                <div className="relative aspect-[16/7] overflow-hidden">
                  <Image
                    src={featuredNews.cover || "/placeholder.svg"}
                    alt={featuredNews[locale].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 " />
                </div>
                <CardContent className="p-4 bg-white border-none  shadow-none mt-3 ">
                  <h3 className="text-lg font-semibold  line-clamp-2 mb-2">
                    {featuredNews[locale].title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {format(new Date(featuredNews.createdAt), "d MMMM yyyy", {
                      locale: uz,
                    })}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {featuredNews[locale].description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        <div className="md:col-span-5 grid grid-cols-1 rounded-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 order-2 w-full">
          {otherNews.map((news, index) => (
            <motion.div
              key={news._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onHoverStart={() => setHoveredId(news._id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <Link href={`/${locale}/news/${news.slug}`}>
                <Card className="overflow-hidden h-full rounded-none transition-all duration-300 ">
                  <div className="relative aspect-[16/9] rounded-none overflow-hidden">
                    <Image
                      src={news.cover || "/placeholder.svg"}
                      alt={news[locale].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                      {news[locale].title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {format(new Date(news.createdAt), "d MMMM yyyy", {
                        locale: uz,
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
