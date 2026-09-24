import Hero from "../components/Hero";
import Footer from "../components/Footer";
import GroupCompanyCard from "@/components/group-company-card";
import { getEntries, getSeo } from "@/lib/cms/server";
import type { GroupCompanyEntry } from "@/lib/cms/content-types";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

const TEXT = {
  en: {
    title: "MESMER Group",
    metaDescription:
      "MESMER Group brings together EPC construction, water treatment equipment manufacturing, HDPE pipe and precast production, and engineering education.",
    intro:
      "Our group covers much of the supply chain with its own resources — from engineering and construction to equipment manufacturing, pipes and precast concrete, and training specialists.",
  },
  ru: {
    title: "Группа MESMER",
    metaDescription:
      "Группа MESMER объединяет EPC-строительство, производство оборудования для водоочистки, выпуск ПНД-труб и ЖБИ, а также инженерное образование.",
    intro:
      "Группа закрывает значительную часть цепочки поставок собственными ресурсами — от инжиниринга и строительства до производства оборудования, труб и ЖБИ и подготовки специалистов.",
  },
  uz: {
    title: "MESMER Group",
    metaDescription:
      "MESMER Group EPC qurilish, suv tozalash uskunalari ishlab chiqarish, HDPE quvurlar va temir-beton buyumlar ishlab chiqarish hamda muhandislik ta’limini birlashtiradi.",
    intro:
      "Guruh ta’minot zanjirining katta qismini o‘z resurslari bilan qamrab oladi — muhandislik va qurilishdan tortib uskunalar, quvurlar va temir-beton buyumlar ishlab chiqarish hamda mutaxassislar tayyorlashgacha.",
  },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = pickLocale((await params).locale);
  return pageMetadata({ locale, path: "/group", ...(await getSeo("group", locale, { title: `${TEXT[locale].title} | MESMER`, description: TEXT[locale].metaDescription })), image: "/about.png" });
}

export default async function GroupPage({ params }: Props) {
  const locale = pickLocale((await params).locale);
  const text = TEXT[locale];
  const companies = JSON.parse(JSON.stringify(await getEntries("group_companies"))) as GroupCompanyEntry[];

  return (
    <div className="bg-white">
      <Hero title={text.title} subtitle="" backgroundImage="/about.png" height="420px" headingTag="h1" />
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-gray-700">{text.intro}</p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {companies.map((company) => (
            <GroupCompanyCard key={company._id} company={company} locale={locale} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
