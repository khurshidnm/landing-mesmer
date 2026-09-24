import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import { localizeHref, t } from "@/lib/cms/definitions";
import type { GroupCompanyEntry } from "@/lib/cms/content-types";

/** Page on this site for a group company: its internal page, or /group/<slug>. */
export function groupCompanyHref(company: GroupCompanyEntry, locale: string) {
  return company.page_href ? localizeHref(company.page_href, locale) : `/${locale}/group/${company.slug}`;
}

export const websiteLabel = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Card for a MESMER Group company (spec 4.7). */
export default function GroupCompanyCard({ company, locale }: { company: GroupCompanyEntry; locale: string }) {
  return (
    <div className="group relative flex h-full items-start gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {company.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={company.logo} alt={company.name} className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 bg-white object-contain p-1" />
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-extrabold text-white">
          {company.name.charAt(0)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-950 transition-colors group-hover:text-blue-600">
            {/* Stretched link: the whole card opens the company page */}
            <Link href={groupCompanyHref(company, locale)} className="after:absolute after:inset-0 after:content-['']">
              {company.name}
            </Link>
          </h3>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-blue-600" />
        </div>
        {t(company.tagline, locale) && <p className="mt-1 text-sm font-medium text-blue-700">{t(company.tagline, locale)}</p>}
        {t(company.description, locale) && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
            {t(company.description, locale).split(/\n\s*\n/)[0]}
          </p>
        )}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <Globe className="h-4 w-4" />
            {websiteLabel(company.website)}
          </a>
        )}
      </div>
    </div>
  );
}
