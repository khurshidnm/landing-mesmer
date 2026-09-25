import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronRight } from "lucide-react";
import Image from "@/components/BluredImage";
import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import NewsCard from "@/components/news-card";
import type { NewsItem } from "@/types/news";
import { NEWS_TEXT, formatNewsDate, type NewsLocale } from "@/lib/news-display";

export default function NewsArticle({
  news,
  related,
  locale,
}: {
  news: NewsItem | null;
  related: NewsItem[];
  locale: NewsLocale;
}) {
  const text = NEWS_TEXT[locale];
  const article = news?.[locale];
  const backLink = (
    <Link
      href={`/${locale}/news`}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
    >
      <ArrowLeft className="h-4 w-4" /> {text.back}
    </Link>
  );

  if (!news || !article) {
    return (
      <div className="bg-white">
        <Hero title={text.title} subtitle={text.eyebrow} backgroundImage="/news.png" height="420px" headingTag="p" />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="mb-6 text-lg text-gray-600">{text.notFound}</p>
          {backLink}
        </div>
        <Footer />
      </div>
    );
  }

  const url = `https://www.mesmer.uz/${locale}/news/${news.slug}`;

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `https://www.mesmer.uz/${locale}` },
                { "@type": "ListItem", position: 2, name: "News", item: `https://www.mesmer.uz/${locale}/news` },
                { "@type": "ListItem", position: 3, name: article.title, item: url },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: article.title,
              description: article.description,
              image: news.cover?.startsWith("http") ? news.cover : `https://www.mesmer.uz${news.cover}`,
              datePublished: news.createdAt,
              dateModified: news.updatedAt || news.createdAt,
              mainEntityOfPage: url,
              publisher: {
                "@type": "Organization",
                name: "MESMER",
                logo: { "@type": "ImageObject", url: "https://www.mesmer.uz/blacklogo.svg" },
              },
              author: { "@type": "Organization", name: "MESMER" },
            },
          ]),
        }}
      />

      <Hero title={text.title} subtitle={text.eyebrow} backgroundImage="/news.png" height="420px" headingTag="p" />

      <article className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-blue-600">{text.home}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${locale}/news`} className="hover:text-blue-600">{text.title}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="line-clamp-1 text-gray-700">{article.title}</span>
          </nav>

          <header className="mb-8 border-b border-gray-100 pb-8">
            <span className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              {formatNewsDate(news.createdAt, locale)}
            </span>
            <h1 className="text-2xl font-bold leading-tight text-gray-950 sm:text-3xl md:text-4xl">{article.title}</h1>
            {article.description && (
              <p className="mt-5 text-lg leading-relaxed text-gray-600">{article.description}</p>
            )}
          </header>

          {news.cover && (
            <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
              <Image src={news.cover} alt={article.title} fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
            </div>
          )}

          <div
            className="article-content text-base leading-relaxed text-gray-800 sm:text-lg"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />

          <div className="mt-12 border-t border-gray-100 pt-8">{backLink}</div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{text.eyebrow}</span>
                <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">{text.more}</h2>
              </div>
              <Link href={`/${locale}/news`} className="hidden whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-700 sm:inline">
                {text.back} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <NewsCard key={item._id} item={item} locale={locale} readMore={text.readMore} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
