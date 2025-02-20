"use client";
import { useEffect, useState } from "react";
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

interface JobListing {
  _id: number;
  uz: LocaleData;
  ru: LocaleData;
  en: LocaleData;
  salary: string;
  createdAt: string;
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

export default function JobListings({
  vacancies,
}: {
  vacancies: JobListing[];
}) {
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
  console.log(locale);

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
      <div className="flex flex-col container justify-between mt-5 mx-auto w-full items-center md:flex-row">
        <div className="w-full md:w-1/2"></div>

        <div className="w-full md:w-1/2">
          <div className="grid gap-6 w-full">
            {filteredVacancies.map((job: JobListing, index: number) => (
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
                        ].conditions.map((condition, i) => (
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
                        ].requirements.map((requirement, i) => (
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
                        ].responsibilities.map((responsibility, i) => (
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
