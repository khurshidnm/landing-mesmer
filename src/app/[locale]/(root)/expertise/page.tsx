import Link from "next/link";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import CoreExpertise from "../components/CoreExpertise";
import FinanciersBlock from "../components/FinanciersBlock";
import { getEntries, getSeo } from "@/lib/cms/server";
import { serialize, type ExpertiseEntry, type FinancierEntry } from "@/lib/cms/content-types";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

const TEXT = {
  en: {
    title: "Our Core Expertise",
    subtitle: "Expertise",
    metaTitle: "Water & Wastewater Engineering Expertise | EPC Contractor Uzbekistan | MESMER",
    metaDescription:
      "Water treatment, wastewater treatment, water supply networks, irrigation and full EPC delivery — MESMER’s core expertise across Uzbekistan and Central Asia.",
    intro:
      "MESMER specialises in water and wastewater infrastructure. Each area below links to the services we deliver and the projects we have built.",
    cta: "Discuss your project",
  },
  ru: {
    title: "Наша ключевая экспертиза",
    subtitle: "Экспертиза",
    metaTitle: "Экспертиза в водоснабжении и водоотведении | EPC-подрядчик | MESMER",
    metaDescription:
      "Водоподготовка, очистка сточных вод, сети водоснабжения, ирригация и EPC «под ключ» — ключевая экспертиза MESMER в Узбекистане и Центральной Азии.",
    intro:
      "MESMER специализируется на объектах водоснабжения и водоотведения. По каждому направлению — перечень услуг и реализованные проекты.",
    cta: "Обсудить проект",
  },
  uz: {
    title: "Asosiy yo‘nalishlarimiz",
    subtitle: "Ekspertiza",
    metaTitle: "Suv va oqova suv muhandisligi | EPC pudratchi | MESMER",
    metaDescription:
      "Suv tozalash, oqova suv tozalash, suv ta’minoti tarmoqlari, irrigatsiya va to‘liq EPC — MESMERning O‘zbekiston va Markaziy Osiyodagi asosiy yo‘nalishlari.",
    intro:
      "MESMER suv ta’minoti va oqova suv infratuzilmasiga ixtisoslashgan. Har bir yo‘nalish bo‘yicha xizmatlar va amalga oshirilgan loyihalar bilan tanishing.",
    cta: "Loyihani muhokama qilish",
  },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = pickLocale((await params).locale);
  return pageMetadata({ locale, path: "/expertise", ...(await getSeo("expertise", locale, { title: TEXT[locale].metaTitle, description: TEXT[locale].metaDescription })), image: "/services.png" });
}

export default async function ExpertisePage({ params }: Props) {
  const locale = pickLocale((await params).locale);
  const text = TEXT[locale];
  const [expertise, financiers] = await Promise.all([getEntries("expertise"), getEntries("financiers")]);

  return (
    <div className="bg-white">
      <Hero title={text.title} subtitle={text.subtitle} backgroundImage="/services.png" height="460px" headingTag="h1" />
      <div className="max-w-7xl mx-auto px-4 pt-16 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-lg leading-relaxed text-gray-700">{text.intro}</p>
      </div>
      <CoreExpertise items={serialize(expertise) as ExpertiseEntry[]} showHeading={false} />
      <FinanciersBlock financiers={serialize(financiers) as FinancierEntry[]} />
      <div className="max-w-7xl mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/start-a-project`}
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:bg-blue-700"
        >
          {text.cta} →
        </Link>
      </div>
      <Footer />
    </div>
  );
}
