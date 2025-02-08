"use client";

import { useState } from "react";
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
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-4 gap-6 order-2">
          {news?.slice(1).map((news, index) => (
            <motion.div
              key={news._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onHoverStart={() => setHoveredId(news?._id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <Link href={`/${locale}/news/${news?.slug}`}>
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={news.cover || "/placeholder.svg"}
                      alt={news.uz.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                      {news?.uz?.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {format(news?.createdAt || new Date(), "d MMMM yyyy", {
                        locale: uz,
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        {news?.[0] && (
          <motion.div
            key={news?.[0]?._id}
            className="md:col-span-3 md:col-start-3 order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setHoveredId(news?.[0]?._id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <Link href={`/${locale}/news/${news?.[0]?.slug}`}>
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-[16/7] overflow-hidden">
                  <Image
                    src={news?.[0]?.cover || "/placeholder.svg"}
                    alt={news?.[0]?.uz.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                    {news?.[0]?.uz.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {format(news?.[0]?.createdAt || new Date(), "d MMMM yyyy", {
                      locale: uz,
                    })}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {news?.[0]?.uz.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
