"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "@/components/BluredImage";
import { ArrowRight, OctagonAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { use } from "react";

const ProjectsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as const;

  const t = useTranslations("home.projects");
  const locale = useLocale();
  console.log(locale);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-12"
      >
        <div className="flex flex-col mt-5 lg:flex-row justify-between items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              {t("title")}
            </h1>
          </div>
          <div className="space-y-6 max-w-2xl">
            <motion.div variants={fadeInUp}>
              <div className="space-y-8">
                <motion.p
                  variants={fadeInUp}
                  className="text-xl md:text-2xl leading-relaxed"
                >
                  {t("sub_title")}
                </motion.p>

                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src="/projects.png"
                    alt="Team collaboration"
                    fill
                    className="object-cover"
                  />
                </div>

                <motion.p
                  variants={fadeInUp}
                  className="text-gray-600 leading-relaxed"
                >
                  {t("description")}
                </motion.p>
                <motion.div variants={fadeInUp} className="mt-8">
                  <Link href={`/${locale}/projects`} passHref>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg text-lg font-medium transition-colors duration-300">
                      {t("button")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
