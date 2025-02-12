"use client";

import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { Cards } from "../components/Cards";
import { useTranslations } from "next-intl";

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
const t = useTranslations("news")
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
      </div>
      <Footer />
    </div>
  );
};

export default News;
