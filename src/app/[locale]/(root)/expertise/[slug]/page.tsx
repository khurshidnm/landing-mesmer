import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "@/components/BluredImage";
import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import ProjectCard, { type ProjectCardData } from "@/components/project-card";
import Projects from "@/database/projects.model";
import { connectToDatabase } from "@/lib/mongoose";
import { getEntries } from "@/lib/cms/server";
import { t, tList } from "@/lib/cms/definitions";
import type { ExpertiseEntry, FinancierEntry } from "@/lib/cms/content-types";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

const TEXT = {
  en: { section: "Expertise", back: "All expertise", services: "What we deliver", projects: "Related projects", allProjects: "See all", cta: "Start a project", ctaTitle: "Planning a similar project?" },
  ru: { section: "Экспертиза", back: "Вся экспертиза", services: "Что мы делаем", projects: "Реализованные проекты", allProjects: "Смотреть все", cta: "Начать проект", ctaTitle: "Планируете похожий проект?" },
  uz: { section: "Ekspertiza", back: "Barcha yo‘nalishlar", services: "Biz nimalarni bajaramiz", projects: "Tegishli loyihalar", allProjects: "Barchasini ko‘rish", cta: "Loyiha boshlash", ctaTitle: "Shunga o‘xshash loyihani rejalashtiryapsizmi?" },
};

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(slug: string) {
  const items = (await getEntries("expertise")) as ExpertiseEntry[];
  return items.find((e) => e.slug === slug);
}

export async function generateMetadata({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = pickLocale(raw);
  const item = await load(slug);
  if (!item) return {};
  return pageMetadata({
    locale,
    path: `/expertise/${slug}`,
    title: `${t(item.title, locale)} | MESMER`,
    description: t(item.summary, locale),
    image: item.image || "/services.png",
  });
}

export default async function ExpertiseDetailPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = pickLocale(raw);
  const text = TEXT[locale];
  const item = await load(slug);
  if (!item) notFound();

  let projects: ProjectCardData[] = [];
  if (item.project_category) {
    await connectToDatabase();
    projects = JSON.parse(
      JSON.stringify(
        await Projects.find({ category: item.project_category }).sort({ start_date: -1, createdAt: -1 }).limit(6).lean()
      )
    );
  }
  const financiers = (await getEntries("financiers")) as FinancierEntry[];
  const financierName = (s?: string) => financiers.find((f) => f.slug === s)?.name || "";
  const services = tList(item.services, locale);

  return (
    <div className="bg-white">
      <Hero title={t(item.title, locale)} subtitle={text.section} backgroundImage={item.image || "/services.png"} height="420px" headingTag="h1" />

      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link href={`/${locale}/expertise`} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {text.back}
        </Link>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            {t(item.summary, locale) && <p className="text-lg leading-relaxed text-gray-700">{t(item.summary, locale)}</p>}
            {services.length > 0 && (
              <>
                <h2 className="mb-4 mt-10 text-2xl font-bold text-gray-950">{text.services}</h2>
                <ul className="space-y-3">
                  {services.map((service) => (
                    <li key={service} className="flex items-start gap-3 text-gray-800">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      {service}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {item.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
              <Image src={item.image} alt={t(item.title, locale)} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </section>

      {projects.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">{text.projects}</h2>
              <Link href={`/${locale}/projects?category=${item.project_category}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                {text.allProjects} →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} locale={locale} financierName={financierName(project.financier)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-lg border border-gray-200 bg-gray-50 p-8 md:flex-row">
          <h2 className="text-xl font-bold text-gray-950">{text.ctaTitle}</h2>
          <Link href={`/${locale}/start-a-project`} className="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">
            {text.cta} →
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
