import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";
import { getSeo } from "@/lib/cms/server";

export const dynamic = "force-dynamic";

const TEXT = {
  en: {
    title: "Start a Project",
    metaTitle: "Start a Project with MESMER | Water & Wastewater EPC Contractor",
    metaDescription:
      "Send your project scope or tender documents to MESMER. Our engineering and EPC team reviews WTP, WWTP and water supply inquiries and responds quickly.",
    eyebrow: "Why MESMER",
    heading: "One partner from design to operation",
    points: [
      "Turnkey EPC delivery under FIDIC conditions",
      "Experience with ADB, EBRD and World Bank financed projects",
      "ISO 9001, ISO 14001 and ISO 45001 certified management system",
      "In-house equipment, pipes and precast production within MESMER Group",
    ],
    contact: "Prefer to talk first?",
    contactLink: "Contact us",
  },
  ru: {
    title: "Начать проект",
    metaTitle: "Начать проект с MESMER | EPC-подрядчик ВОС и КОС",
    metaDescription:
      "Отправьте параметры объекта или тендерную документацию. Инженеры MESMER рассмотрят запрос по ВОС, КОС и водоснабжению и оперативно ответят.",
    eyebrow: "Почему MESMER",
    heading: "Один партнёр — от проекта до эксплуатации",
    points: [
      "Строительство «под ключ» (EPC) по условиям FIDIC",
      "Опыт проектов, финансируемых АБР, ЕБРР и Всемирным банком",
      "Система менеджмента по ISO 9001, ISO 14001 и ISO 45001",
      "Собственное производство оборудования, труб и ЖБИ в группе MESMER",
    ],
    contact: "Хотите сначала обсудить?",
    contactLink: "Свяжитесь с нами",
  },
  uz: {
    title: "Loyiha boshlash",
    metaTitle: "MESMER bilan loyiha boshlash | Suv va oqova suv EPC pudratchisi",
    metaDescription:
      "Loyiha parametrlari yoki tender hujjatlarini yuboring. MESMER muhandislari WTP, WWTP va suv ta’minoti bo‘yicha murojaatingizni ko‘rib chiqib, tezda javob beradi.",
    eyebrow: "Nega MESMER",
    heading: "Loyihalashdan ekspluatatsiyagacha bitta hamkor",
    points: [
      "FIDIC shartlari asosida to‘liq kalit ostida (EPC) qurilish",
      "OTB, EBRD va Jahon banki moliyalashtirgan loyihalar tajribasi",
      "ISO 9001, ISO 14001 va ISO 45001 bo‘yicha menejment tizimi",
      "MESMER guruhida uskunalar, quvurlar va temir-beton buyumlarni ishlab chiqarish",
    ],
    contact: "Avval gaplashib olmoqchimisiz?",
    contactLink: "Biz bilan bog‘laning",
  },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = pickLocale((await params).locale);
  const text = TEXT[locale];
  return pageMetadata({ locale, path: "/start-a-project", ...(await getSeo("start-a-project", locale, { title: text.metaTitle, description: text.metaDescription })), image: "/contact.png" });
}

export default async function StartAProjectPage({ params }: Props) {
  const locale = pickLocale((await params).locale);
  const text = TEXT[locale];

  return (
    <div className="bg-white">
      <Hero title={text.title} subtitle="" backgroundImage="/contact.png" height="420px" headingTag="h1" />
      <section id="form" className="container mx-auto scroll-mt-24 px-4 py-16">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">
            <div>
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-blue-600">{text.eyebrow}</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">{text.heading}</h2>
            </div>
            <ul className="space-y-3">
              {text.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="border-t border-gray-100 pt-6 text-sm text-gray-600">
              {text.contact}{" "}
              <Link href={`/${locale}/contact`} className="font-semibold text-blue-600 hover:text-blue-700">
                {text.contactLink} →
              </Link>
            </p>
          </div>
          <div className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <Suspense>
              <ProjectInquiryForm />
            </Suspense>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
