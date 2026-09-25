import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "@/components/BluredImage";
import type { NewsItem } from "@/types/news";
import { formatNewsDate, type NewsLocale } from "@/lib/news-display";

/** News card used on the news list and under an article. `featured` is the wide first card. */
export default function NewsCard({
  item,
  locale,
  readMore,
  featured = false,
}: {
  item: NewsItem;
  locale: NewsLocale;
  readMore: string;
  featured?: boolean;
}) {
  const text = item[locale] || item.en;
  const href = `/${locale}/news/${item.slug}`;

  return (
    <Link
      href={href}
      className={`group flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${
        featured ? "flex-col lg:flex-row" : "h-full flex-col"
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-gray-100 ${featured ? "aspect-[16/9] lg:aspect-auto lg:w-[58%] lg:min-h-[380px]" : "aspect-[16/10]"}`}>
        <Image
          src={item.cover || "/news.png"}
          alt={text.title}
          fill
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className={`flex flex-1 flex-col gap-3 ${featured ? "p-6 sm:p-8 lg:p-10 lg:justify-center" : "p-5"}`}>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <CalendarDays className="h-4 w-4 text-blue-600" />
          {formatNewsDate(item.createdAt, locale)}
        </span>
        <h3
          className={`font-bold leading-snug text-gray-950 transition-colors group-hover:text-blue-700 ${
            featured ? "text-xl sm:text-2xl lg:text-3xl" : "line-clamp-2 text-lg"
          }`}
        >
          {text.title}
        </h3>
        {text.description && (
          <p className={`text-sm leading-relaxed text-gray-600 ${featured ? "line-clamp-4 sm:text-base" : "line-clamp-3"}`}>
            {text.description}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-blue-600">
          {readMore}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
