import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Globe, Mail, MapPin, Phone } from "lucide-react";
import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import GroupCompanyCard, { websiteLabel } from "@/components/group-company-card";
import { getEntries } from "@/lib/cms/server";
import { t, tList } from "@/lib/cms/definitions";
import type { GroupCompanyEntry } from "@/lib/cms/content-types";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

const TEXT = {
  en: { back: "MESMER Group", website: "Visit website", others: "Other group companies", group: "MESMER Group", facts: "Key facts", contacts: "Contacts" },
  ru: { back: "Группа MESMER", website: "Перейти на сайт", others: "Другие компании группы", group: "Группа MESMER", facts: "Ключевые факты", contacts: "Контакты" },
  uz: { back: "MESMER Group", website: "Saytga o‘tish", others: "Guruhning boshqa kompaniyalari", group: "MESMER Group", facts: "Asosiy faktlar", contacts: "Kontaktlar" },
};

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(slug: string) {
  const companies = JSON.parse(JSON.stringify(await getEntries("group_companies"))) as GroupCompanyEntry[];
  return { company: companies.find((c) => c.slug === slug), others: companies.filter((c) => c.slug !== slug) };
}

export async function generateMetadata({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = pickLocale(raw);
  const { company } = await load(slug);
  if (!company) return {};
  return pageMetadata({
    locale,
    path: `/group/${slug}`,
    title: `${company.name} | MESMER Group`,
    description: t(company.description, locale) || t(company.tagline, locale),
    image: "/about.png",
  });
}

export default async function GroupCompanyPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = pickLocale(raw);
  const text = TEXT[locale];
  const { company, others } = await load(slug);
  if (!company) notFound();

  return (
    <div className="bg-white">
      <Hero title={company.name} subtitle={text.group} backgroundImage="/about.png" height="420px" headingTag="h1" />
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link href={`/${locale}/group`} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {text.back}
        </Link>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            {t(company.tagline, locale) && (
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">{t(company.tagline, locale)}</p>
            )}
            <div className="space-y-4">
              {t(company.description, locale)
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="text-lg leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                ))}
            </div>
            {tList(company.facts, locale).length > 0 && (
              <>
                <h2 className="mb-4 mt-10 text-2xl font-bold text-gray-950">{text.facts}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {tList(company.facts, locale).map((fact) => (
                    <li key={fact} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-800">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="h-fit space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-28">
            <h2 className="border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wider text-gray-800">{text.contacts}</h2>
            <ul className="space-y-3 text-sm text-gray-800">
              {company.website && (
                <li className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {websiteLabel(company.website)}
                  </a>
                </li>
              )}
              {t(company.address, locale) && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{t(company.address, locale)}</span>
                </li>
              )}
              {company.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} className="hover:text-blue-600">
                    {company.phone}
                  </a>
                </li>
              )}
              {company.email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <a href={`mailto:${company.email}`} className="hover:text-blue-600">
                    {company.email}
                  </a>
                </li>
              )}
            </ul>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {text.website} <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </aside>
        </div>
      </section>
      {others.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-gray-950">{text.others}</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {others.map((c) => (
                <GroupCompanyCard key={c._id} company={c} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
