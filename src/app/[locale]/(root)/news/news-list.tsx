import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import NewsCard from "@/components/news-card";
import { getNews } from "@/app/admin/(admin)/(root)/news/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import { NEWS_TEXT, pickNewsLocale } from "@/lib/news-display";
import type { NewsItem } from "@/types/news";
import type { IPagination } from "@/types";

const PER_PAGE = 10;

export default async function NewsList({ locale: rawLocale, page }: { locale: string; page: number }) {
  const locale = pickNewsLocale(rawLocale);
  const text = NEWS_TEXT[locale];
  const { news = [], pagination } = parseServerActionJson<{ news?: NewsItem[]; pagination?: IPagination }>(
    await getNews({ page, limit: PER_PAGE }),
    {}
  );
  const pages = pagination?.pages || 1;
  const base = `/${locale}/news`;
  const pageHref = (n: number) => (n > 1 ? `${base}?page=${n}` : base);
  // The newest article is shown wide on the first page
  const [featured, ...rest] = page === 1 ? news : [undefined, ...news];

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `https://www.mesmer.uz/${locale}` },
              { "@type": "ListItem", position: 2, name: "News", item: `https://www.mesmer.uz/${locale}/news` },
            ],
          }),
        }}
      />

      <Hero backgroundImage="/news.png" height="420px" title={text.title} subtitle={text.eyebrow} headingTag="h1" />

      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-gray-100 pb-8 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{text.eyebrow}</span>
            <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">{text.heading}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-600">{text.intro}</p>
        </div>

        {news.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">{text.empty}</p>
        ) : (
          <>
            {featured && (
              <div className="mb-8">
                <NewsCard item={featured} locale={locale} readMore={text.readMore} featured />
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => item && <NewsCard key={item._id} item={item} locale={locale} readMore={text.readMore} />)}
              </div>
            )}
          </>
        )}

        {pages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Pagination">
            <Link
              href={pageHref(Math.max(1, page - 1))}
              aria-disabled={page === 1}
              aria-label="Previous page"
              className={`rounded-full border border-gray-200 p-3 transition-colors hover:bg-gray-100 ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    n === page ? "bg-blue-600 font-bold text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </Link>
              ))}
            </div>
            <Link
              href={pageHref(Math.min(pages, page + 1))}
              aria-disabled={page >= pages}
              aria-label="Next page"
              className={`rounded-full border border-gray-200 p-3 transition-colors hover:bg-gray-100 ${page >= pages ? "pointer-events-none opacity-40" : ""}`}
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </nav>
        )}
      </section>
      <Footer />
    </div>
  );
}
