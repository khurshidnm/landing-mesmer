"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Hero from "../../components/Hero";
import { ProjectsItem } from "../page-wiew";
import Gallery from "../../components/Gallery";

export default function ProjectPage({ project }: { project: ProjectsItem }) {
  return (
    <>
      <Hero
        title=""
        subtitle={`Наши проекты / ${project.ru.title}`}
        backgroundImage="/our.png"
        height="500px"
      />
      <article className="min-h-screen bg-white container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto pt-8">
          <div className="border-l-4 border-blue-600 pl-6">
            <h1 className="text-3xl font-bold text-black mb-2">О ПРОЕКТЕ</h1>
            <h2 className="text-2xl text-gray-800">{project.ru.main_title}</h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
        >
          <Image
            src={project.cover}
            alt={project.ru.title}
            fill
            className="object-cover"
          />
        </motion.div>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2"></div>
          <div className="container mx-auto py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-8 sm:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6 text-gray-800"
              >
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.ru.description }}
                ></p>
                <p className="text-base sm:text-lg leading-relaxed">
                  Объем задач: {project.ru.volume_of_tasks}
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  Заказчик: {project.ru.customer}
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  Статус: {project.ru.status}
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  Сроки реализации: {project.ru.implementation_period}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
        <Gallery photos={project.gallery} />
      </article>
    </>
  );
}
