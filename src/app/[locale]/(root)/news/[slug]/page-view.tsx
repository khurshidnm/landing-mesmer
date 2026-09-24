"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Hero from "../../components/Hero";
import { NewsItem } from "@/types/news";
import { useLocale, useTranslations } from "next-intl";
import Footer from "../../components/Footer";

export default function NewsPage({ news }: { news: NewsItem | null }) {
  const locale = useLocale() as "uz" | "ru" | "en";
  const localizedNews = news?.[locale];
  const t = useTranslations("news");

  if (!news || !localizedNews) {
    return (
      <>
        <Hero
          title=""
          subtitle={t("title")}
          backgroundImage="/our.png"
          height="500px"
        />
        <div className="container mx-auto py-24 text-center">
          <p className="text-lg text-gray-600 mb-6">
            {t("not_found") || "Yangilik topilmadi"}
          </p>
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back") || "Orqaga"}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Hero
        title=""
        subtitle={`${t("title")} / ${localizedNews.title}`}
        backgroundImage="/our.png"
        height="500px"
      />

      {/* Schema.org NewsArticle & BreadcrumbList */}
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
              {
                "@type": "ListItem",
                position: 3,
                name: localizedNews.title,
                item: `https://www.mesmer.uz/${locale}/news/${news.slug}`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: localizedNews.title,
            description: localizedNews.description,
            image: news.cover?.startsWith("http") ? news.cover : `https://www.mesmer.uz${news.cover}`,
            datePublished: news.createdAt || new Date().toISOString(),
            mainEntityOfPage: `https://www.mesmer.uz/${locale}/news/${news.slug}`,
            publisher: {
              "@type": "Organization",
              name: "MESMER",
              logo: {
                "@type": "ImageObject",
                url: "https://www.mesmer.uz/blacklogo.svg",
              },
            },
            author: {
              "@type": "Organization",
              name: "MESMER",
            },
          }),
        }}
      />
      <article className="min-h-screen bg-white container mx-auto">
        <div className="pt-8">
          <div className="border-l-4 border-blue-600 pl-6">
            <h1 className="text-3xl font-bold text-black mb-2">{t("single")}</h1>
            <h2 className="text-2xl text-gray-800">{localizedNews.title}</h2>
            <br />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
        >
          <Image
            src={news.cover}
            alt={localizedNews.title || "Новость"}
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="flex flex-col lg:flex-row">
          <div className="container mx-auto py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-8 sm:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 text-gray-800"
              >
                <div
                  className="article-content text-base sm:text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: localizedNews.content || "",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
