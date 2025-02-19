"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "@/components/BluredImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export interface ProjectsItem {
  _id: string;
  uz: {
    title: string;
    main_title: string;
    description: string;
    volume_of_tasks: string;
    customer: string;
    status: string;
    implementation_period: string;
  };
  en: {
    title: string;
    main_title: string;
    description: string;
    volume_of_tasks: string;
    customer: string;
    status: string;
    implementation_period: string;
  };
  ru: {
    title: string;
    main_title: string;
    description: string;
    volume_of_tasks: string;
    customer: string;
    status: string;
    implementation_period: string;
  };
  slug: string;
  cover: string;
  gallery: string[];
}

export interface ProjectsGridProps {
  items: ProjectsItem[];
  onPreview: (slug: string) => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}

const ITEMS_PER_PAGE = 5;

const ProjectsList = ({ projects }: { projects: ProjectsItem[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const firstProjectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstProjectRef.current) {
      firstProjectRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  const locale = useLocale();
  const t = useTranslations("projects")

  return (
    <>
      <Hero
        backgroundImage="/projects.jpg.png"
        title={t("title")}
        subtitle=""
        height="500px"
      />
      <div className="mx-auto  container w-full py-16 flex flex-col md:flex-row  ">
        <div className="md:w-1/3 w-full   ">
          <h1 className="text-3xl md:text-4xl font-bold mb-12">
          {t("main_title")}
          </h1>
        </div>

        <div className="md:w-2/3 overflow-y-auto w-full ">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-16"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                variants={item}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" 
                ref={index === 0 ? firstProjectRef : null}
              >
                <div className="md:col-span-3">
                  <span className="text-8xl font-bold text-gray-200">
                    {/* {project.number} */}
                  </span>
                </div>

                <div className="md:col-span-9 space-y-6">
                  <h2 className="text-2xl font-semibold">{project.uz.title}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        {t("project.task")}:
                      </h3>
                      <p className="text-sm">
                        {project.uz.volume_of_tasks}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        {t("project.customer")}:
                      </h3>
                      <p className="text-sm">{project.uz.customer}</p>
                    </div>
                  </div>

                  {/* <div className="relative aspect-[16/9] w-full overflow-hidden ">
                    <Link href={`/${locale}/projects/${project.slug}`}>
                      <Image
                        src={project.cover || "/placeholder.svg"}
                        alt={project.uz.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </div> */}

                  <div className="flex justify-between items-center flex-wrap text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{t("project.status")}:</span>
                      <span>{project.uz.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{t("project.implementation")}:</span>
                      <span>{project.uz.implementation_period}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProjectsList;
