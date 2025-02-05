"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  imageUrl: string;
  category: string;
}

const sampleNews: NewsItem[] = [
  {
    id: "1",
    title:
      "Запуск нового проекта по строительству канала подачи воды М2 в рамках инициативы",
    description:
      "Проект по строительству канала подачи воды М2 выведен на улучшение водоснабжения в регионе. В рамках этой инициативы планируется создать современную инфраструктуру.",
    date: new Date("2024-03-12"),
    imageUrl: "/news.png",
    category: "Инфраструктура",
  },
  {
    id: "2",
    title: "Открытие нового IT-хаба в центре города",
    description:
      "Новый IT-хаб предлагает современные коворкинги, акселерационные программы и поддержку стартапов. Планируется создать более 500 рабочих мест.",
    date: new Date("2024-04-05"),
    imageUrl: "/news.png",
    category: "Технологии",
  },
  {
    id: "3",
    title:
      "Запуск нового проекта по строительству канала подачи воды М2 в рамках инициативы",
    description:
      "Проект по строительству канала подачи воды М2 выведен на улучшение водоснабжения в регионе. В рамках этой инициативы планируется создать современную инфраструктуру.",
    date: new Date("2024-03-12"),
    imageUrl: "/news.png",
    category: "Инфраструктура",
  },
  {
    id: "4",
    title: "Открытие нового IT-хаба в центре города",
    description:
      "Новый IT-хаб предлагает современные коворкинги, акселерационные программы и поддержку стартапов. Планируется создать более 500 рабочих мест.",
    date: new Date("2024-04-05"),
    imageUrl: "/news.png",
    category: "Технологии",
  },
  {
    id: "5",
    title:
      "Запуск нового проекта по строительству канала подачи воды М2 в рамках инициативы",
    description:
      "Проект по строительству канала подачи воды М2 выведен на улучшение водоснабжения в регионе. В рамках этой инициативы планируется создать современную инфраструктуру.",
    date: new Date("2024-03-12"),
    imageUrl: "/news.png",
    category: "Инфраструктура",
  },
];

export function Cards() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-4 gap-6 order-2">
          {sampleNews.slice(1).map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onHoverStart={() => setHoveredId(news.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <Link href={`/news/${news.id}`}>
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={news.imageUrl || "/placeholder.svg"}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {format(news.date, "d MMMM yyyy", { locale: uz })}
                    </p>
                    <p className="text-gray-700 text-sm font-medium">
                      {news.category}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          key={sampleNews[0].id}
          className="md:col-span-3 md:col-start-3 order-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onHoverStart={() => setHoveredId(sampleNews[0].id)}
          onHoverEnd={() => setHoveredId(null)}
        >
          <Link href={`/news/${sampleNews[0].id}`}>
            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-[16/7] overflow-hidden">
                <Image
                  src={sampleNews[0].imageUrl || "/placeholder.svg"}
                  alt={sampleNews[0].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                  {sampleNews[0].title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {format(sampleNews[0].date, "d MMMM yyyy", { locale: uz })}
                </p>
                <p className="text-gray-700 text-sm font-medium">
                  {sampleNews[0].category}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {sampleNews[0].description}
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
