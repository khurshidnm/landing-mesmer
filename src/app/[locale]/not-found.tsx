"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, Home, Building2, Wrench, Briefcase, Newspaper, Phone } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  const locale = useLocale();
  const isEn = locale === "en";
  const isRu = locale === "ru";

  const navigationLinks = [
    {
      href: `/${locale}`,
      label: isEn ? "Home" : isRu ? "Главная" : "Bosh sahifa",
      icon: Home,
      desc: isEn ? "Return to main page" : isRu ? "Перейти на главную" : "Asosiy sahifaga qaytish",
    },
    {
      href: `/${locale}/services`,
      label: isEn ? "Services & Expertise" : isRu ? "Услуги и инжиниринг" : "Xizmatlar va ekspertiza",
      icon: Wrench,
      desc: isEn ? "Turnkey WWTP & WTP engineering" : isRu ? "Проектирование и строительство КОС/ВОС" : "WWTP va WTP qurilishi",
    },
    {
      href: `/${locale}/projects`,
      label: isEn ? "Projects Portfolio" : isRu ? "Портфолио проектов" : "Loyihalar portfeli",
      icon: Building2,
      desc: isEn ? "Municipal water infrastructure contracts" : isRu ? "Объекты водной инфраструктуры" : "Suv infratuzilmasi loyihalari",
    },
    {
      href: `/${locale}/career`,
      label: isEn ? "Careers" : isRu ? "Карьера и вакансии" : "Bo'sh ish o'rinlari",
      icon: Briefcase,
      desc: isEn ? "Engineering opportunities" : isRu ? "Вакансии инженеров" : "Muhandislik imkoniyatlari",
    },
    {
      href: `/${locale}/news`,
      label: isEn ? "Company News" : isRu ? "Новости" : "Yangiliklar",
      icon: Newspaper,
      desc: isEn ? "Construction updates & milestones" : isRu ? "События и пресс-релизы" : "So'nggi xabarlar",
    },
    {
      href: `/${locale}/contact`,
      label: isEn ? "Contact Us" : isRu ? "Контакты" : "Bog'lanish",
      icon: Phone,
      desc: isEn ? "Inquiries & project proposals" : isRu ? "Связаться с нами" : "Biz bilan bog'lanish",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-gray-900">
      {/* Header bar */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href={`/${locale}`} className="inline-block">
            <Image
              src="/blacklogo.svg"
              alt="MESMER Logo"
              width={120}
              height={30}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? "Back to MESMER Home" : isRu ? "Вернуться на главную" : "Asosiy sahifaga"}</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Hero Section */}
      <main className="container mx-auto px-4 py-16 sm:py-24 text-center max-w-4xl">
        <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-3 block">
          {isEn ? "Error 404 • Page Not Found" : isRu ? "Ошибка 404 • Страница не найдена" : "404 Xatolik • Sahifa topilmadi"}
        </span>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-950 mb-4 tracking-tight">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {isEn
            ? "The page you are looking for does not exist"
            : isRu
            ? "Запрошенная страница не существует или была перемещена"
            : "Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan"}
        </h2>

        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {isEn
            ? "The link may be outdated, or the address was typed incorrectly. Explore our core sections below to find water and wastewater infrastructure information."
            : isRu
            ? "Возможно, ссылка устарела или адрес введен неверно. Воспользуйтесь быстрой навигацией по ключевым разделам сайта."
            : "Manzil xato kiritilgan bo'lishi mumkin. Saytimizning asosiy bo'limlaridan birini tanlang."}
        </p>

        {/* Quick Section Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left mb-12">
          {navigationLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-blue-600 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.label}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Home Button */}
        <div>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-none transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{isEn ? "Go to Homepage" : isRu ? "На главную страницу" : "Bosh sahifaga o'tish"}</span>
          </Link>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="py-6 border-t border-gray-200 text-center text-xs text-gray-500 bg-white">
        <p>© {new Date().getFullYear()} MESMER-EAST LLC. Water & Wastewater Treatment EPC Contractor.</p>
      </footer>
    </div>
  );
}
