"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, DollarSign } from "lucide-react";
import Hero from "../components/Hero";
import { JobApplicationModal } from "../components/JobModal";
import { format } from "date-fns";
import Footer from "../components/Footer";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VACANCY_CATEGORIES } from "@/lib/cms/definitions";

interface JobListing {
  _id: number;
  uz: LocaleData;
  ru: LocaleData;
  en: LocaleData;
  salary: string;
  createdAt: string;
  category?: string;
}

interface LocaleData {
  title: string;
  company: string;
  conditions: string[];
  requirements: string[];
  responsibilities: string[];
}

function isValidLocale(
  locale: string
): locale is keyof Pick<JobListing, "uz" | "ru" | "en"> {
  return ["uz", "ru", "en"].includes(locale);
}

const FILTER_TEXT = {
  en: { title: "Directions", all: "All vacancies", empty: "No open vacancies in this direction right now." },
  ru: { title: "Направления", all: "Все вакансии", empty: "Сейчас нет открытых вакансий по этому направлению." },
  uz: { title: "Yo‘nalishlar", all: "Barcha vakansiyalar", empty: "Hozircha bu yo‘nalishda ochiq vakansiyalar yo‘q." },
} as const;

export default function JobListings({
  vacancies: allVacancies,
}: {
  vacancies: JobListing[];
}) {
  // Careers menu links: /career?category=engineering
  const category = useSearchParams().get("category") || "";
  // Memoized: the effect below depends on it, so a new array every render would loop
  const vacancies = useMemo(
    () => (category ? allVacancies.filter((v) => v.category === category) : allVacancies),
    [allVacancies, category]
  );
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState(vacancies.length);
  const [filteredVacancies, setFilteredVacancies] = useState(vacancies.slice(0, limit));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  useEffect(() => {
    setFilteredVacancies(vacancies.slice(0, limit));
    setTotal(vacancies.length);
  }, [vacancies, limit]);

  const handleOpenModal = (job: JobListing) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };
  const locale = useLocale();
  const safeLocale = isValidLocale(locale) ? locale : "en";
  const filterText = FILTER_TEXT[safeLocale];
  const counts = (value: string) => allVacancies.filter((v) => v.category === value).length;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const t = useTranslations("career");

  return (
    <>
      <Hero
        title={t("title")}
        subtitle=""
        backgroundImage="/vacancy.png"
        height="500px"
      />
      <div
        id="vacancies"
        className="flex flex-col container justify-between gap-8 mt-5 mx-auto w-full items-start md:flex-row scroll-mt-24"
      >
        <nav className="w-full md:w-1/2 md:sticky md:top-28 pt-4" aria-label={filterText.title}>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">{filterText.title}</p>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-start">
            {[{ value: "", label: filterText.all, count: allVacancies.length }, ...VACANCY_CATEGORIES.map((c) => ({ value: c.value, label: c[safeLocale], count: counts(c.value) }))]
              .filter((item) => item.value === "" || item.count > 0 || item.value === category)
              .map((item) => (
                <Link
                  key={item.value || "all"}
                  href={`/${safeLocale}/career${item.value ? `?category=${item.value}` : ""}#vacancies`}
                  scroll={false}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    category === item.value
                      ? "border-blue-600 bg-blue-600 font-semibold text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                  <span className={`text-xs ${category === item.value ? "text-white/80" : "text-gray-400"}`}>{item.count}</span>
                </Link>
              ))}
          </div>
        </nav>

        <div className="w-full md:w-1/2">
          {vacancies.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">{filterText.empty}</p>
          )}
          <div className="grid gap-6 w-full">
            {filteredVacancies?.map((job: JobListing, index: number) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-none rounded-none hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-3 bg-gradient-to-r from-blue-50 to-white p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {
                              job[
                                safeLocale as keyof Pick<
                                  JobListing,
                                  "uz" | "ru" | "en"
                                >
                              ].title
                            }
                          </h3>
                          <p className="text-sm text-gray-600">
                            {
                              job[
                                safeLocale as keyof Pick<
                                  JobListing,
                                  "uz" | "ru" | "en"
                                >
                              ].company
                            }
                          </p>
                        </div>
                        <div className="flex items-center rounded-none text-blue-600">
                          <span className="font-medium text-sm">
                            {job.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {t("terms")}:
                      </h4>
                      <ul className="space-y-1">
                        {job[
                          safeLocale as keyof Pick<
                            JobListing,
                            "uz" | "ru" | "en"
                          >
                        ].conditions?.map((condition, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <span className="mr-2 mt-1.5 h-1 w-1  bg-blue-600 flex-shrink-0" />
                            <span className="text-gray-600">{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {t("requirements")}:
                      </h4>
                      <ul className="space-y-1">
                        {job[
                          safeLocale as keyof Pick<
                            JobListing,
                            "uz" | "ru" | "en"
                          >
                        ].requirements?.map((requirement, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-blue-600 flex-shrink-0" />
                            <span className="text-gray-600">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {t("responsibilities")}:
                      </h4>
                      <ul className="space-y-1">
                        {job[
                          safeLocale as keyof Pick<
                            JobListing,
                            "uz" | "ru" | "en"
                          >
                        ].responsibilities?.map((responsibility, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <span className="mr-2 mt-1.5 h-1 w-1 bg-blue-600 flex-shrink-0" />
                            <span className="text-gray-600">
                              {responsibility}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between gap-4 border-t bg-gray-50/50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">
                        {t("created_at")}:{" "}
                        {format(new Date(job.createdAt), "dd.MM.yyyy")}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 rounded-none text-white"
                      onClick={() => handleOpenModal(job)}
                    >
                      <Briefcase className="w-3 h-3 mr-2" />
                      {t("respond")}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 rounded-none border-blue-600 hover:bg-blue-50"
              onClick={() => setLimit(limit + 3)}
              // disabled with total and limit
              disabled={total <= limit}
            >
              {t("view_more")}
            </Button>
          </div>
        </div>
      </div>
      {selectedJob && (
        <JobApplicationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          jobTitle={
            selectedJob[
              safeLocale as keyof Pick<JobListing, "uz" | "ru" | "en">
            ].title
          }
        />
      )}
      <div className="py-6"></div>
      <Footer />
    </>
  );
}
