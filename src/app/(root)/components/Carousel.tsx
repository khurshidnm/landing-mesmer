"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import garmoshka from "@/../public/garmoshka.png";

const activities = [
  {
    id: 1,
    number: "01",
    image: garmoshka,
    title: "Развитие бизнеса в строительстве",
    description:
      "Комплексное развитие строительного бизнеса с применением инновационных технологий и современных методов управления.",
  },
  {
    id: 2,
    number: "02",
    image: garmoshka,
    title: "Управление проектными работами",
    description:
      "Эффективное управление проектами любой сложности с учетом современных стандартов и требований рынка.",
  },
  {
    id: 3,
    number: "03",
    image: garmoshka,
    title: "Закупка оборудования",
    description:
      "Профессиональный подход к закупке и поставке высококачественного оборудования для различных отраслей.",
  },
  {
    id: 4,
    number: "04",
    image: garmoshka,
    title: "Эксплуатация и техническое обслуживание",
    description:
      "Комплексное обслуживание и поддержка технического оборудования на всех этапах эксплуатации.",
  },
  {
    id: 5,
    number: "05",
    image: garmoshka,
    title: "Эксплуатация и техническое обслуживание",
    description:
      "Профессиональное техническое обслуживание и своевременная поддержка всех систем.",
  },
  {
    id: 6,
    number: "06",
    image: garmoshka,
    title: "Инженерно-техническое проектирование",
    description:
      "Разработка инновационных инженерных решений и технической документации любой сложности.",
  },
  {
    id: 7,
    number: "07",
    image: garmoshka,
    title: "Финансовая поддержка",
    description:
      "Комплексные решения по финансированию и поддержке проектов на всех этапах реализации.",
  },
];

const BusinessActivities = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12">
        СФЕРА ДЕЯТЕЛЬНОСТИ
      </h1>

      <div className="space-y-2 sm:space-y-3">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            layout
            onClick={() => setActiveId(activity.id)}
            className={`relative cursor-pointer overflow-hidden rounded-lg transition-all ${
              activeId === activity.id ? "bg-blue-600" : "bg-white"
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
                  activeId === activity.id ? "text-white/20" : "text-gray-200"
                }`}
              >
                {activity.number}
              </span>

              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-3 sm:mr-4 md:mr-6 flex-shrink-0">
                <Image
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
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
                  {activity.title}
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
                      {activity.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                layout="position"
                className="ml-2 sm:ml-4 flex-shrink-0"
              >
                <ArrowUpRight
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                    activeId === activity.id ? "text-white" : "text-gray-400"
                  }`}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BusinessActivities;
