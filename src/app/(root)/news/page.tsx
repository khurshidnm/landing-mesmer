"use client";

import React from "react";
import Hero from "../components/Hero";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import { NewsGrid } from "@/components/news-grid";
import { Card } from "@/components/ui/card";
import { Cards } from "../components/Cards";

const newsItems = [
  {
    id: 1,
    title: "Запуск нового проекта по строительству канала подачи воды М2",
    date: "Добавлено: 12.03.2025",
    image: "/news.jpg.png",
    description: "Краткое описание основного проекта...",
    featured: true,
  },
  ...Array(9).fill({
    id: 2,
    title: "Запуск нового проекта по строительству канала подачи воды М2",
    date: "Добавлено: 10.03.2025",
    image: "/news.jpg.png",
    description: "Краткое описание...",
    featured: false,
  }),
];

const News = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div>
      <Hero
        backgroundImage="/news.png"
        height="70vh"
        title="Новости"
        subtitle=""
      />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl ${
                item.featured ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <Link href={`/news/${item.id}`}>
                <div className="relative aspect-video">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <div className="mb-2 text-sm text-gray-500">{item.date}</div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>
          ))}
        </motion.div> */}
        <Cards />
      </div>
      <Footer />
    </div>
  );
};

export default News;
