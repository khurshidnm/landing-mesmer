"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Hero from "../../components/Hero";
import Gallery from "../../components/Gallery";

export default function ProjectPage() {
  return (
    <>
      <Hero
        title=""
        subtitle="Наши проекты / Канал подачи воды М2"
        backgroundImage="/our.png"
        height="80vh"
      />
      <article className="min-h-screen bg-white container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title */}
        <div className="container mx-auto pt-8">
          <div className="border-l-4 border-blue-600 pl-6">
            <h1 className="text-3xl font-bold text-black mb-2">О ПРОЕКТЕ</h1>
            <h2 className="text-2xl text-gray-800">
              Проект реконструкции КОС в Чирчике:
              <br />
              Новый этап социально значимого проекта
            </h2>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
        >
          <Image
            src="/project.jpg.png"
            alt="Проект реконструкции КОС"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2"></div>
          <div className="container mx-auto py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-8 sm:gap-12">
              {/* Project Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 text-gray-800"
              >
                <p className="text-base sm:text-lg leading-relaxed">
                  ООО «MESMER-EAST» в совместно с ООО «ALKATEX» осуществляет
                  проектирование строительства нового канализационного очистного
                  сооружения (КОС) в городе Чирчик. Работы ведутся в рамках
                  контракта № TS-CW-02 Lot 2 — "Реконструкция КОС мощностью 100
                  000 м3/сутки в г. Чирчик".
                </p>

                <p className="text-base sm:text-lg leading-relaxed">
                  В настоящее время подрядчик завершает этап проектирования
                  перед началом работ. Проект реконструкции станет крупнейшим
                  инфраструктурным проектом по модернизации канализационной
                  системы в городе и районах Ташкентской области, который имеет
                  важное социальное значение для региона.
                </p>
              </motion.div>

              {/* Project Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kT10ZV0ceQCLaUN1fOoxZVAMWqsfIb.png"
                    alt="Посещение строительного участка"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-base sm:text-lg leading-relaxed text-gray-800">
                  <p>
                    Фактический статус по проекту на 01.07.2023: В ходе
                    посещения строительного участка АБР под руководством г-на
                    Хуршеда Алама Даниэля (АБР) и при содействии регулярная
                    инспекция со стороны банка. Так, 25 августа 2023 года
                    строительный участок посетила миссия АБР под руководством
                    Масахиро Устрой. В ходе визита представителям банка был
                    предоставлен статус по проекту, проведен осмотр площадки,
                    представлен общий отчет и продемонстрирован прогресс на
                    объекте.
                  </p>
                </div>
              </motion.div>

              {/* Project Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                <p className="text-base sm:text-lg leading-relaxed text-gray-800">
                  Проект направлен на улучшение экологической ситуации Анализ
                  последствий и характеристики микроструктур, распределение и
                  наполнение.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
        <Gallery />
      </article>
    </>
  );
}
