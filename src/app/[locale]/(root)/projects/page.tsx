"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "@/components/BluredImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import type { IPagination } from "@/types";
import { getProjects } from "@/app/admin/(admin)/(root)/projects/server-action";

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

const ProjectsList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstProjectRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<ProjectsItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    next: 0,
    prev: 0,
  });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchProjects = async () => {
    try {
      const projectsData = await getProjects({
        page,
        limit,
        slug: null,
      });
      const { projects, pagination } = JSON.parse(projectsData);
      setProjects(projects);
      setPagination(pagination);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, limit]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const locale = useLocale() as "uz" | "en" | "ru";
  const t = useTranslations("projects");

  // Handle page change
  const handlePageChange = (page: number) => setPage(page);

  return (
    <>
      <Hero
        backgroundImage="/projects.png"
        title={t("title")}
        subtitle=""
        height="500px"
      />
      <div className="mx-auto container w-full py-16">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("main_title")}
          </h1>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {projects?.map((project, index) => (
            <motion.div
              key={project._id}
              variants={item}
              className="bg-white rounded-lg overflow-hidden h-full flex flex-col"
              ref={index === 0 ? firstProjectRef : null}
            >
              {/* Project Number */}
              <div className="px-6 pt-6">
                <span className="text-4xl font-bold text-gray-300">
                  {String(
                    pagination.total - (page - 1) * limit - index
                  ).padStart(2, "0")}
                  .
                </span>
              </div>

              {/* Project Content */}
              <div className="px-6 pb-6 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {project?.[locale]?.title}
                </h2>

                {/* Project Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg mb-6">
                  <Image
                    src={project.cover || "/placeholder.svg"}
                    alt={project?.[locale]?.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Project Details Grid */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {t("project.task")}:
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {project?.[locale]?.volume_of_tasks}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {t("project.customer")}:
                      </h3>
                      <p className="text-sm text-gray-700">
                        {project?.[locale]?.customer}
                      </p>
                    </div>
                  </div>

                  {/* Status and Implementation */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        {t("project.status")}:
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full">
                        {project[locale].status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        {t("project.implementation")}:
                      </span>
                      <span className="text-xs text-gray-700">
                        {project?.[locale]?.implementation_period}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(pagination.prev)}
              disabled={pagination.page === 1}
              className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors font-medium ${
                    page === i + 1
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.next)}
              disabled={pagination.page === pagination.pages}
              className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProjectsList;
