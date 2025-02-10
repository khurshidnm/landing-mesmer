"use client";

import React from "react";
import Hero from "../components/Hero";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "@/components/BluredImage";
import Link from "next/link";
import Footer from "../components/Footer";
import { NewsGrid } from "@/components/news-grid";
import { Card } from "@/components/ui/card";
import { Cards } from "../components/Cards";

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

const News = ({ news }: { news: NewsItem[] }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div>
      <Hero
        backgroundImage="/news.png"
        height="500px"
        title="Новости"
        subtitle=""
      />
      <div className="rounded-none mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Cards news={news} />
      </div>
      <Footer />
    </div>
  );
};

export default News;
