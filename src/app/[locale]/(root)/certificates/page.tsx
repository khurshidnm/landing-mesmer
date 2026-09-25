import Link from "next/link";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import CertificatesGrid from "./certificates-grid";
import { getSertificates } from "../../../admin/(admin)/(root)/certificates/server-action";
import { parseServerActionJson } from "@/lib/parse-server-action-json";
import type { Certificate } from "@/types/certificates";
import { getSeo } from "@/lib/cms/server";
import { pageMetadata, pickLocale } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

const TEXT = {
  en: {
    title: "Certificates",
    subtitle: "Quality, safety and the environment",
    metaTitle: "Certificates | MESMER",
    metaDescription:
      "MESMER's international ISO certificates for quality, environmental and occupational health & safety management systems.",
    eyebrow: "Certified management systems",
    heading: "Our certificates",
    intro:
      "Our management systems are certified to international ISO standards. Click a certificate to view it in full size.",
    view: "View certificate",
    empty: "Certificates will be published soon.",
    calloutTitle: "Need copies of our certificates for a tender?",
    calloutText: "Contact us and we will send the documents you need.",
    calloutCta: "Contact us",
  },
  ru: {
    title: "Сертификаты",
    subtitle: "Качество, безопасность и экология",
    metaTitle: "Сертификаты | MESMER",
    metaDescription:
      "Международные сертификаты ISO компании MESMER: системы менеджмента качества, экологического менеджмента, охраны труда и безопасности.",
    eyebrow: "Сертифицированные системы менеджмента",
    heading: "Наши сертификаты",
    intro:
      "Наши системы менеджмента сертифицированы по международным стандартам ISO. Нажмите на сертификат, чтобы открыть его в полном размере.",
    view: "Открыть сертификат",
    empty: "Сертификаты скоро будут опубликованы.",
    calloutTitle: "Нужны копии сертификатов для тендера?",
    calloutText: "Свяжитесь с нами, и мы отправим необходимые документы.",
    calloutCta: "Связаться с нами",
  },
  uz: {
    title: "Sertifikatlar",
    subtitle: "Sifat, xavfsizlik va ekologiya",
    metaTitle: "Sertifikatlar | MESMER",
    metaDescription:
      "MESMER kompaniyasining sifat, atrof-muhit hamda mehnat muhofazasi va xavfsizlik menejmenti tizimlari bo‘yicha xalqaro ISO sertifikatlari.",
    eyebrow: "Sertifikatlangan menejment tizimlari",
    heading: "Sertifikatlarimiz",
    intro:
      "Menejment tizimlarimiz xalqaro ISO standartlari bo‘yicha sertifikatlangan. Sertifikatni to‘liq hajmda ko‘rish uchun ustiga bosing.",
    view: "Sertifikatni ochish",
    empty: "Sertifikatlar tez orada e’lon qilinadi.",
    calloutTitle: "Tender uchun sertifikat nusxalari kerakmi?",
    calloutText: "Biz bilan bog‘laning — kerakli hujjatlarni yuboramiz.",
    calloutCta: "Bog‘lanish",
  },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = pickLocale((await params).locale);
  const text = TEXT[locale];
  return pageMetadata({
    locale,
    path: "/certificates",
    ...(await getSeo("certificates", locale, { title: text.metaTitle, description: text.metaDescription })),
    image: "/about.png",
  });
}

export default async function CertificatesPage({ params }: Props) {
  const locale = pickLocale((await params).locale);
  const text = TEXT[locale];
  const certificates = parseServerActionJson<Certificate[]>(await getSertificates(), []);

  return (
    <div className="bg-white">
      <Hero title={text.title} subtitle={text.subtitle} backgroundImage="/about.png" height="420px" headingTag="h1" />

      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-gray-100 pb-8 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{text.eyebrow}</span>
            <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">{text.heading}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-600">{text.intro}</p>
        </div>

        {certificates.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">{text.empty}</p>
        ) : (
          <CertificatesGrid certificates={certificates} locale={locale} viewLabel={text.view} />
        )}

        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-lg border border-gray-200 bg-gray-50 p-8 md:flex-row">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-950">{text.calloutTitle}</h3>
            <p className="max-w-xl text-sm text-gray-600">{text.calloutText}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {text.calloutCta} &rarr;
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
