"use client";

import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { trackContactClick } from "@/lib/analytics";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { t as cmsText } from "@/lib/cms/definitions";
import { useSiteData } from "@/components/site/site-data";

export default function ContactClientView() {
  const t = useTranslations("contact");
  const locale = useLocale() as "en" | "ru" | "uz";
  // Website Content → Footer & Contact, falling back to the built-in texts
  const { texts } = useSiteData();
  const txt = (value: Parameters<typeof cmsText>[0], fallback: string) => cmsText(value, locale) || fallback;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  } as const;

  const [constants, setConstants] = useState({
    number: "+ 998 (55) 518 88 70",
    email: "info@mesmer.uz",
    location: "Ташкент, Алмазарский район, улица Широк, 100. Индекс 100069",
    address: {} as { uz?: string; ru?: string; en?: string } | undefined,
    profile_pdf: "" as string | undefined,
  });

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const res = await axios.get("/api/consts");
        if (res.data?.data?.constant) {
          setConstants(res.data.data.constant);
        }
      } catch (error) {
        console.error("Error fetching site constants:", error);
      }
    };
    fetchConstants();
  }, []);

  return (
    <div className="overflow-x-clip bg-white">
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `https://www.mesmer.uz/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Contacts & Start a Project",
                item: `https://www.mesmer.uz/${locale}/contact`,
              },
            ],
          }),
        }}
      />

      <Hero
        title={txt(texts?.contact_title, t("title"))}
        subtitle=""
        backgroundImage="/contact.png"
        height="500px"
        headingTag="h1"
      />

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Corporate Dossier & Direct Contacts */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="lg:col-span-5 space-y-8 lg:sticky lg:top-28"
          >
            <div>
              <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2 block">
                {txt(texts?.contact_eyebrow, t("contacts"))}
              </span>
              <h2 className="text-3xl font-extrabold text-gray-950 mb-3 tracking-tight">
                {txt(texts?.contact_company, "MESMER-EAST LLC")}
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {txt(
                  texts?.contact_intro,
                  locale === "ru"
                    ? "Генеральный подрядчик полного цикла (EPC) по проектированию, строительству и модернизации водоочистных станций (ВОС), очистных сооружений канализации (КОС) и насосных станций в Узбекистане."
                    : locale === "uz"
                    ? "O'zbekistonda suv tozalash inshootlari (WTP), oqova suv tozalash inshootlari (WWTP) va nasos stansiyalarini loyihalash hamda qurish bo'yicha to'liq sikldagi bosh pudratchi (EPC)."
                    : "Full-cycle EPC general contractor specializing in turnkey water treatment plants (WTP), wastewater treatment plants (WWTP), and municipal water infrastructure across Uzbekistan and Central Asia."
                )}
              </p>
            </div>

            {/* Corporate Qualifications */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    {txt(texts?.contact_standards_title, "FIDIC & EPC Standards")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {txt(texts?.contact_standards_text, "ISO 9001:2015 • ISO 14001:2015 • ISO 45001:2018")}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Points */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  {locale === "ru" ? "Телефон" : locale === "uz" ? "Telefon" : "Corporate Phone"}
                </p>
                <a
                  href={`tel:${constants.number.replace(/\s+/g, "")}`}
                  onClick={() => trackContactClick("phone", constants.number)}
                  className="text-xl font-bold text-gray-950 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>{constants.number}</span>
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  {locale === "ru" ? "Электронная почта" : locale === "uz" ? "Elektron pochta" : "Corporate Email"}
                </p>
                <a
                  href={`mailto:${constants.email}`}
                  onClick={() => trackContactClick("email", constants.email)}
                  className="text-xl font-bold text-gray-950 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>{constants.email}</span>
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  {locale === "ru" ? "Адрес головного офиса" : locale === "uz" ? "Bosh ofis manzili" : "Head Office Location"}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {constants.address?.[locale] || constants.location}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                  {locale === "ru" ? "Официальные каналы" : locale === "uz" ? "Rasmiy kanallar" : "Official Channels"}
                </p>
                <a
                  href="https://www.linkedin.com/company/mesmer-llc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackContactClick(
                      "linkedin",
                      "https://www.linkedin.com/company/mesmer-llc/"
                    )
                  }
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-900 hover:text-blue-600 hover:bg-gray-100 transition-colors text-sm font-semibold border border-gray-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 fill-[#0A66C2]"
                    aria-hidden="true"
                  >
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                  </svg>
                  <span className="whitespace-nowrap">
                    {locale === "ru"
                      ? "Официальная страница в LinkedIn"
                      : locale === "uz"
                      ? "LinkedIn rasmiy sahifasi"
                      : "LinkedIn Official Page"}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: B2B Project Inquiry Form */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm relative"
          >
            <ProjectInquiryForm />
          </motion.div>
        </div>
      </section>

      {/* Restored MESMER Interactive Map */}
      <section className="w-full h-[450px] relative border-t border-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.282085454949!2d69.25003407610318!3d41.3679556713023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d5957156a9d%3A0xe6246f9e25d08b2!2z0KPQuy4g0KjQuNGA0L7Qug!5e0!3m2!1sru!2s!4v1738844575214!5m2!1sru!2s"
          className="w-full h-full border-0"
          loading="lazy"
          title="MESMER Head Office Location"
        />
      </section>

      <Footer />
    </div>
  );
}
