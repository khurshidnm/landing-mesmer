"use client";
import { useState } from "react";
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

interface JobListing {
  _id: number;
  uz: {
    title: string;
    company: string;
    conditions: string[];
    requirements: string[];
    responsibilities: string[];
  };
  ru: {
    title: string;
    company: string;
    conditions: string[];
    requirements: string[];
    responsibilities: string[];
  };
  en: {
    title: string;
    company: string;
    conditions: string[];
    requirements: string[];
    responsibilities: string[];
  };
  salary: string;
  date: string;
}

export default function JobListings({
  vacancies,
}: {
  vacancies: JobListing[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const handleOpenModal = (job: JobListing) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      <Hero
        title="Вакансии"
        subtitle=""
        backgroundImage="/contact.png"
        height="500px"
      />
      <div className="flex flex-col justify-center items-center md:flex-row">
        <div className="w-full md:w-1/2"></div>

        <div className="w-full md:w-1/2 px-8 py-12 md:mr-[200px] ">
          <div className="grid gap-6 max-w-xl mx-auto">
            {vacancies.map((job: JobListing, index: number) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-none hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-3 bg-gradient-to-r from-blue-50 to-white p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.ru.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {job.ru.company}
                          </p>
                        </div>
                        <div className="flex items-center text-blue-600">
                          <DollarSign className="w-4 h-4 mr-1" />
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
                        Условия:
                      </h4>
                      <ul className="space-y-1">
                        {job.ru.conditions.map((condition, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-blue-600 flex-shrink-0" />
                            <span className="text-gray-600">{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Требования:
                      </h4>
                      <ul className="space-y-1">
                        {job.ru.requirements.map((requirement, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-blue-600 flex-shrink-0" />
                            <span className="text-gray-600">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Обязанности:
                      </h4>
                      <ul className="space-y-1">
                        {job.ru.responsibilities.map((responsibility, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-blue-600 flex-shrink-0" />
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
                        Дата публикации: {job.date}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleOpenModal(job)}
                    >
                      <Briefcase className="w-3 h-3 mr-2" />
                      ОТКЛИКНУТЬСЯ
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
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              ЕЩЕ ВАКАНСИИ
            </Button>
          </div>
        </div>
      </div>
      {selectedJob && (
        <JobApplicationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          jobTitle={selectedJob.ru.title}
        />
      )}
    </>
  );
}
