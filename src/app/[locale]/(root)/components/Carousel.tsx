"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "@/components/BluredImage";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const activities = [
  {
    id: 1,
    number: "01",
    image: "/activity1.png",
    ru_title: "Развитие бизнеса в строительстве",
    ru_description: "Комплексное развитие строительного бизнеса с применением инновационных технологий и современных методов управления.",
    en_title: "Business Development in Construction",
    en_description: "Comprehensive development of the construction business using innovative technologies and modern management methods.",
    uz_title: "Qurilish biznesini rivojlantirish",
    uz_description: "Qurilish biznesini innovatsion texnologiyalar va zamonaviy boshqaruv usullari yordamida kompleks rivojlantirish.",
  },
  {
    id: 2,
    number: "02",
    image: "/activity2.png",
    ru_title: "Управление проектными работами",
    ru_description: "Эффективное управление проектами любой сложности с учетом современных стандартов и требований рынка.",
    en_title: "Project Management",
    en_description: "Efficient management of projects of any complexity, taking into account modern standards and market requirements.",
    uz_title: "Loyihalarni boshqarish",
    uz_description: "Har qanday murakkablikdagi loyihalarni zamonaviy standartlar va bozor talablari asosida samarali boshqarish.",
  },
  {
    id: 3,
    number: "03",
    image: "/activity3.png",
    ru_title: "Закупка оборудования",
    ru_description: "Профессиональный подход к закупке и поставке высококачественного оборудования для различных отраслей.",
    en_title: "Equipment Procurement",
    en_description: "A professional approach to the procurement and supply of high-quality equipment for various industries.",
    uz_title: "Uskunalar xaridi",
    uz_description: "Turli sohalar uchun yuqori sifatli uskunalarni xarid qilish va yetkazib berish bo‘yicha professional yondashuv.",
  },
  {
    id: 4,
    number: "04",
    image: "/activity4.png",
    ru_title: "Эксплуатация и техническое обслуживание",
    ru_description: "Профессиональное техническое обслуживание и своевременная поддержка всех систем.",
    en_title: "Operation and Technical Support",
    en_description: "Professional technical maintenance and timely support for all systems.",
    uz_title: "Ekspluatatsiya va texnik qo‘llab-quvvatlash",
    uz_description: "Barcha tizimlar uchun professional texnik xizmat ko‘rsatish va o‘z vaqtida qo‘llab-quvvatlash.",
  },
  {
    id: 5,
    number: "05",
    image: "/activity5.png",
    ru_title: "Инженерно-техническое проектирование",
    ru_description: "Разработка инновационных инженерных решений и технической документации любой сложности.",
    en_title: "Engineering and Technical Design",
    en_description: "Development of innovative engineering solutions and technical documentation of any complexity.",
    uz_title: "Muhandislik-texnik loyihalash",
    uz_description: "Har qanday murakkablikdagi innovatsion muhandislik yechimlari va texnik hujjatlarni ishlab chiqish.",
  },
];


const BusinessActivities = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const t = useTranslations("home.activities");
  const locale = useLocale()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12">
        {t("title")}
      </h1>

      <div className="space-y-2 sm:space-y-3">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            layout
            onMouseEnter={() => setActiveId(activity.id)}
            onMouseLeave={() => setActiveId(null)}
            className={`relative overflow-hidden rounded-lg transition-all ${
              activeId === activity.id ? "bg-blue-600 text-white" : "bg-white"
            }`}
            animate={{
              backgroundColor: activeId === activity.id ? "#2563eb" : "#f9fafb",
              scale: activeId === activity.id ? 1 : 0.98,
              opacity: activeId === activity.id ? 1 : 0.8,
            }}
            transition={{
              duration: 0.15,
            }}
          >
            <motion.div
              layout="position"
              className="flex items-center p-3 sm:p-4 md:p-6"
            >
              <span
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mr-3 sm:mr-4 md:mr-6 transition-colors duration-300 ${
                  activeId === activity.id ? "text-white" : "text-gray-200"
                }`}
              >
                {activity.number}
              </span>

              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-3 sm:mr-4 md:mr-6 flex-shrink-0">
                <Image
                  src={activity.image || "/placeholder.svg"}
                  alt={activity[`${locale as "uz" | "ru" | "en"}_title`]}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base sm:text-lg md:text-xl font-medium transition-colors duration-300 truncate ${
                    activeId === activity.id ? "text-white" : "text-gray-900"
                  }`}
                >
                  {activity[`${locale as "uz" | "ru" | "en"}_title`]}
                </h3>

                <AnimatePresence>
                  {activeId === activity.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-white/80 mt-2 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-none"
                    >
                      {activity[`${locale as "uz" | "ru" | "en"}_description`]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                layout="position"
                className="ml-2 sm:ml-4 flex-shrink-0"
              >
              {/* <ArrowUpRight
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                    activeId === activity.id ? "text-white" : "text-gray-400"
                  }`}
                /> */}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BusinessActivities;
