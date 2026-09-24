"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { ProjectsItem } from "../projects/page";
import { ArrowRight, CheckCircle2, ShieldCheck, Waves, Factory, Building2, Globe2 } from "lucide-react";

interface ServicesClientProps {
  featuredProjects?: ProjectsItem[];
}

const ServicesClientView = ({ featuredProjects = [] }: ServicesClientProps) => {
  const locale = useLocale() as "uz" | "ru" | "en";
  const t = useTranslations("services");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  } as const;

  const isEn = locale === "en";
  const isRu = locale === "ru";

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <Hero
        title={
          isEn
            ? "Water Treatment & Wastewater Infrastructure EPC Contractor in Uzbekistan & Central Asia"
            : isRu
            ? "EPC-подрядчик водоочистных сооружений и водной инфраструктуры в Узбекистане"
            : "O'zbekiston va Markaziy Osiyoda suv tozalash va oqova suv inshootlari EPC pudratchisi"
        }
        subtitle={isEn ? "Expertise & Engineering Services" : isRu ? "Сферы деятельности и инжиниринг" : "Xizmatlar va ekspertiza"}
        backgroundImage="/services.png"
        height="520px"
        headingTag="h1"
      />

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
                name: isEn ? "Services & Expertise" : isRu ? "Услуги и экспертиза" : "Xizmatlar",
                item: `https://www.mesmer.uz/${locale}/services`,
              },
            ],
          }),
        }}
      />

      {/* Breadcrumb / Trust Bar */}
      <section className="border-b border-gray-100 bg-gray-50/70 py-4">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">
              {isEn ? "Home" : isRu ? "Главная" : "Bosh sahifa"}
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">{t("main_title")}</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-blue-900">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {isEn ? "FIDIC / EPC Standards" : isRu ? "Стандарты FIDIC / EPC" : "FIDIC / EPC standartlari"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-blue-600" />
              {isEn ? "ADB & EBRD Financed Projects" : isRu ? "Проекты АБР и ЕБРР" : "OTB va EBRD loyihalari"}
            </span>
          </div>
        </div>
      </section>

      {/* Core Expertise Overview */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2 block">
              {isEn ? "Full-Cycle General Contractor" : isRu ? "Генеральный подрядчик полного цикла" : "To'liq sikldagi bosh pudratchi"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 leading-tight">
              {isEn
                ? "Premier Water Treatment Company & Wastewater EPC Contractor in Uzbekistan"
                : isRu
                ? "Ведущая водоочистная компания и EPC-подрядчик КОС в Узбекистане"
                : "O'zbekistonda suv tozalash va oqova suv inshootlari bo'yicha yetakchi EPC pudratchi"}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              {t("description")}
            </p>
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                {isEn ? "Trusted by International Financial Institutions & Partners" : isRu ? "Доверие международных институтов и партнеров" : "Xalqaro hamkorlar va moliya institutlari"}
              </p>
              <div className="h-[75px] relative w-full max-w-md">
                <Image
                  src="/partners.jpg.svg"
                  alt="MESMER strategic engineering and equipment partners in water treatment"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center mb-4">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">
                {isEn ? "WWTP EPC Central Asia" : isRu ? "EPC-строительство КОС" : "WWTP EPC qurilishi"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {isEn
                  ? "Turnkey engineering, procurement, and construction of municipal and industrial Wastewater Treatment Plants (WWTP) ranging from 20,000 to 60,000+ m³/day."
                  : isRu
                  ? "Проектирование, поставка оборудования и строительство городских и промышленных канализационных очистных сооружений (КОС) мощностью от 20 000 до 60 000+ м³/сут."
                  : "Shahar va sanoat oqova suv tozalash inshootlarini (WWTP) 20 000 dan 60 000+ m³/kun quvvatda to'liq EPC asosida barpo etish."}
              </p>
              <Link
                href={`/${locale}/projects?type=wwtp`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                {isEn ? "WWTP Case Studies" : isRu ? "Проекты КОС" : "WWTP loyihalari"} &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center mb-4">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">
                {isEn ? "WTP Construction Uzbekistan" : isRu ? "Строительство ВОС" : "WTP inshootlari qurilishi"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {isEn
                  ? "Large-scale Water Treatment Plants (WTP) rehabilitation and capacity expansion up to 400,000 m³/day for safe municipal drinking water distribution."
                  : isRu
                  ? "Реконструкция и расширение водоочистных станций (ВОС) мощностью до 400 000 м³/сутки для обеспечения качественной питьевой водой."
                  : "Ichimlik suvi tozalash inshootlarini (WTP) 400 000 m³/kun quvvatgacha kengaytirish va modernizatsiya qilish."}
              </p>
              <Link
                href={`/${locale}/projects?type=wtp`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                {isEn ? "WTP Projects" : isRu ? "Проекты ВОС" : "WTP loyihalari"} &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">
                {isEn ? "Water Infrastructure Contractor" : isRu ? "Подрядчик водной инфраструктуры" : "Suv infratuzilmasi pudratchisi"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {isEn
                  ? "High-capacity pumping stations, pressure force mains, transmission canals, and hydraulic distribution networks built to resilient standards."
                  : isRu
                  ? "Строительство насосных станций, напорных коллекторов, магистральных каналов и водопроводных сетей."
                  : "Yuqori quvvatli nasos stansiyalari, bosimli kollektorlar va magistral suv ta'minoti kanallari qurilishi."}
              </p>
              <Link
                href={`/${locale}/projects`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                {isEn ? "Infrastructure Portfolio" : isRu ? "Портфолио объектов" : "Infratuzilma loyihalari"} &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 mb-2">
                {isEn ? "ADB & EBRD Water Projects" : isRu ? "Проекты АБР и ЕБРР" : "OTB va EBRD loyihalari"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {isEn
                  ? "Extensive execution experience under Asian Development Bank (ADB) and European Bank for Reconstruction and Development (EBRD) loan frameworks."
                  : isRu
                  ? "Многолетний опыт реализации международных контрактов при финансировании Азиатского банка развития (АБР) и ЕБРР."
                  : "Osiyo Taraqqiyot Banki (OTB) va Yevropa Tiklanish va Taraqqiyot Banki (EBRD) loyihalarini yuqori standartlarda bajarish."}
              </p>
              <Link
                href={`/${locale}/projects`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                {isEn ? "International Contracts" : isRu ? "Международные контракты" : "Xalqaro shartnomalar"} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Panorama Banner */}
      <motion.div
        className="w-full h-[280px] sm:h-[380px] relative my-6"
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/servishero.png"
          alt="Wastewater treatment plant EPC construction and engineering in Uzbekistan - MESMER"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
          <div className="container mx-auto px-6 text-white max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-semibold text-blue-400 block mb-2">
              {isEn ? "Proven Regional Track Record" : isRu ? "Региональный опыт" : "Mintaqaviy tajriba"}
            </span>
            <p className="text-xl sm:text-2xl font-bold leading-snug">
              {isEn
                ? "Over 20 years of delivering strategic municipal and industrial water engineering across Central Asia."
                : isRu
                ? "Более 20 лет успешной реализации стратегических объектов водного хозяйства в Центральной Азии."
                : "Markaziy Osiyoda 20 yildan ortiq vaqt davomida strategik suv inshootlarini muvaffaqiyatli qurish tajribasi."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section: Technologies & Engineering Design */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2 block">
                {isEn ? "Advanced Process Engineering" : isRu ? "Передовые технологии" : "Ilg'or texnologiyalar"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-4">
                {t("engineering.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {t("engineering.description")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-base">
                {t("engineering.list.title")}
              </h3>
              <ul className="space-y-2.5">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{t(`engineering.list.label_${item}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/40 rounded-lg p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-950 mb-3 text-base">
                {t("tecnologies.title")}
              </h3>
              <ul className="space-y-2.5">
                {[1, 2, 3, 4].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm sm:text-base text-blue-900">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{t(`tecnologies.list.label_${item}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="relative w-full h-[400px] sm:h-[500px] rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/servishero5.png"
              alt="Water infrastructure contractor technical design and engineering in Uzbekistan"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Section: Equipment Procurement & Operations */}
      <section className="bg-gray-50 py-12 lg:py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2 block">
              {isEn ? "Procurement & Lifecycle Management" : isRu ? "Поставка и сервис" : "Yetkazib berish va servis"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-4">
              {isEn
                ? "Equipment Procurement, Commissioning & Full-Cycle Operations (O&M)"
                : isRu
                ? "Поставка оборудования, пусконаладка и эксплуатация (O&M)"
                : "Uskunalarni yetkazib berish, ishga tushirish va ekspluatatsiya qilish"}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("delivery.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-950">
                {t("experience.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {t("experience.description")}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-950">
                {t("maintenance.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {t("maintenance.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Panorama Image */}
      <motion.div
        className="w-full h-[220px] sm:h-[320px] relative my-8"
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/servishero3.jpg.png"
          alt="Water Treatment Plant WTP construction site panorama Central Asia - MESMER"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Featured Projects Showcase */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2 block">
              {isEn ? "Track Record & Case Studies" : isRu ? "Портфолио проектов" : "Amalga oshirilgan loyihalar"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950">
              {isEn
                ? "Key Water & Wastewater Treatment Projects Delivered by MESMER"
                : isRu
                ? "Ключевые проекты ВОС и КОС, реализованные MESMER"
                : "MESMER tomonidan amalga oshirilgan asosiy suv va oqova suv loyihalari"}
            </h2>
          </div>
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 text-sm"
          >
            {isEn ? "View All Projects" : isRu ? "Все проекты" : "Barcha loyihalar"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.slice(0, 4).map((project) => {
            const localized = project[locale] || project.en || project.ru;
            const textCorpus = `${localized?.title} ${localized?.volume_of_tasks}`.toLowerCase();
            let badge = "Water Infrastructure";
            if (textCorpus.includes("wwtp") || textCorpus.includes("oqova")) badge = "WWTP EPC";
            else if (textCorpus.includes("wtp") || textCorpus.includes("suv tozalash")) badge = "WTP Construction";
            else if (textCorpus.includes("adb") || textCorpus.includes("asian")) badge = "ADB Project";
            else if (textCorpus.includes("ebrd") || textCorpus.includes("reconstruction")) badge = "EBRD Project";

            return (
              <Link
                key={project._id}
                href={`/${locale}/projects/${project.slug}`}
                className="group flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={project.cover || "/placeholder.svg"}
                    alt={`${localized?.title || "Project"} - Water treatment EPC contractor Uzbekistan`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-md text-[11px] font-bold text-gray-900 border border-gray-200 shadow-xs">
                    {badge}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h3 className="font-semibold text-gray-950 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                    {localized?.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {localized?.customer}
                  </p>
                  <span className="text-xs font-semibold text-blue-600 inline-flex items-center gap-1 pt-2 border-t border-gray-100">
                    {isEn ? "Case Study" : isRu ? "Подробнее" : "Batafsil"} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Technical Capabilities & Sector Directory */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-4 block">
            {isEn
              ? "Key Engineering & Contracting Domains"
              : isRu
              ? "Ключевые направления деятельности и специализация"
              : "Asosiy faoliyat va muhandislik yo'nalishlari"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-700">
            <Link
              href={`/${locale}/projects?type=wwtp`}
              className="p-3.5 rounded-lg border border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>{isEn ? "Wastewater Treatment EPC (WWTP)" : isRu ? "Очистные сооружения канализации (КОС)" : "Oqova suv tozalash (WWTP)"}</span>
              &rarr;
            </Link>
            <Link
              href={`/${locale}/projects?type=wtp`}
              className="p-3.5 rounded-lg border border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>{isEn ? "Water Treatment Plants (WTP)" : isRu ? "Водоочистные станции (ВОС)" : "Ichimlik suvi stansiyalari (WTP)"}</span>
              &rarr;
            </Link>
            <Link
              href={`/${locale}/projects`}
              className="p-3.5 rounded-lg border border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>{isEn ? "Water Infrastructure & Pumping Stations" : isRu ? "Насосные станции и гидросооружения" : "Nasos stansiyalari va gidrotexnika"}</span>
              &rarr;
            </Link>
            <Link
              href={`/${locale}/projects?type=adb`}
              className="p-3.5 rounded-lg border border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>{isEn ? "ADB Financed Water Projects" : isRu ? "Проекты Азиатского банка развития (АБР)" : "OTB loyihalari"}</span>
              &rarr;
            </Link>
            <Link
              href={`/${locale}/projects?type=ebrd`}
              className="p-3.5 rounded-lg border border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>{isEn ? "EBRD Water Infrastructure Projects" : isRu ? "Проекты ЕБРР в водном секторе" : "EBRD suv loyihalari"}</span>
              &rarr;
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="p-3.5 rounded-lg border border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-between"
            >
              <span>{isEn ? "EPC General Contracting Inquiries" : isRu ? "Генеральный подряд и инжиниринг" : "Bosh pudrat va konsalting"}</span>
              &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesClientView;
