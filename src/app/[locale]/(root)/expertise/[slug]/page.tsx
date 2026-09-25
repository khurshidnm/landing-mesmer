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

// Built-in texts, used when the matching Website Content → Expertise field is empty
const TEXT = {
  en: { section: "Expertise", back: "All expertise", services: "What we deliver", process: "How we work", projects: "Related projects", allProjects: "See all", cta: "Start a project", ctaTitle: "Planning a similar project?", ctaText: "Send us your project details or tender documents and our engineers will get back to you.", other: "Other expertise" },
  ru: { section: "Экспертиза", back: "Вся экспертиза", services: "Что мы делаем", process: "Как мы работаем", projects: "Реализованные проекты", allProjects: "Смотреть все", cta: "Начать проект", ctaTitle: "Планируете похожий проект?", ctaText: "Отправьте описание объекта или тендерную документацию — наши инженеры свяжутся с вами.", other: "Другие направления" },
  uz: { section: "Ekspertiza", back: "Barcha yo‘nalishlar", services: "Biz nimalarni bajaramiz", process: "Qanday ishlaymiz", projects: "Tegishli loyihalar", allProjects: "Barchasini ko‘rish", cta: "Loyiha boshlash", ctaTitle: "Shunga o‘xshash loyihani rejalashtiryapsizmi?", ctaText: "Obyekt tavsifi yoki tender hujjatlarini yuboring — muhandislarimiz siz bilan bog‘lanadi.", other: "Boshqa yo‘nalishlar" },
};

/** "value | label" lines from the admin panel */
const pairs = (lines: string[]) =>
  lines
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([first]) => first)
    .map(([first, ...rest]) => [first, rest.join(" | ")] as const);

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(slug: string) {
  const items = (await getEntries("expertise")) as ExpertiseEntry[];
  return { item: items.find((e) => e.slug === slug), others: items.filter((e) => e.slug !== slug) };
}

export async function generateMetadata({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = pickLocale(raw);
  const { item } = await load(slug);
  if (!item) return {};
  return pageMetadata({
    locale,
    path: `/expertise/${slug}`,
    title: t(item.seo_title, locale) || `${t(item.title, locale)} | MESMER`,
    description: t(item.seo_description, locale) || t(item.summary, locale),
    image: item.hero_image || item.image || "/services.png",
  });
}

export default async function ExpertiseDetailPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = pickLocale(raw);
  const text = TEXT[locale];
  const { item, others } = await load(slug);
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

  const title = t(item.title, locale);
  const summary = t(item.summary, locale);
  const paragraphs = t(item.body, locale).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const highlights = pairs(tList(item.highlights, locale));
  const services = tList(item.services, locale).filter((s) => s.trim());
  const steps = pairs(tList(item.process, locale));
  const ctaText = t(item.cta_text, locale) || text.ctaText;

  return (
    <div className="bg-white">
      <Hero
        title={title}
        subtitle={t(item.hero_subtitle, locale) || text.section}
        backgroundImage={item.hero_image || item.image || "/services.png"}
        height="420px"
        headingTag="h1"
      />

      {/* Overview */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link href={`/${locale}/expertise`} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" /> {text.back}
        </Link>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{text.section}</span>
            <h2 className="mb-6 text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">{title}</h2>
            {summary && <p className="text-lg leading-relaxed text-gray-800">{summary}</p>}
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">
                {paragraph}
              </p>
            ))}
          </div>
          {item.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
              <Image src={item.image} alt={title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
        </div>

        {highlights.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {highlights.map(([value, label]) => (
              <div key={value + label} className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <div className="text-3xl font-bold text-blue-600 sm:text-4xl">{value}</div>
                {label && <div className="mt-2 text-sm leading-snug text-gray-600">{label}</div>}
              </div>
            ))}
          </div>
        )}
      </section>

      {services.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-gray-950 sm:text-3xl">{t(item.services_title, locale) || text.services}</h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <li key={service} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-5 text-gray-800 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <span className="font-medium">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {steps.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-gray-950 sm:text-3xl">{t(item.process_title, locale) || text.process}</h2>
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {steps.map(([stepTitle, description], i) => (
              <li key={stepTitle + i} className="relative rounded-lg border border-gray-200 p-5">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-gray-950">{stepTitle}</h3>
                {description && <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {projects.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/60">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">{t(item.projects_title, locale) || text.projects}</h2>
              <Link href={`/${locale}/projects?category=${item.project_category}`} className="whitespace-nowrap text-sm font-semibold text-blue-600 hover:text-blue-700">
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
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-950">{t(item.cta_title, locale) || text.ctaTitle}</h2>
            {ctaText && <p className="max-w-xl text-sm text-gray-600">{ctaText}</p>}
          </div>
          <Link href={`/${locale}/start-a-project`} className="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            {t(item.cta_button, locale) || text.cta} →
          </Link>
        </div>

        {others.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">{text.other}</h2>
            <div className="flex flex-wrap gap-2">
              {others.map((other) => (
                <Link
                  key={other._id}
                  href={`/${locale}/expertise/${other.slug}`}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-700"
                >
                  {t(other.title, locale)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
