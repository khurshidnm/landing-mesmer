"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useTranslations } from "next-intl";

const About = () => {
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
  };
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const t = useTranslations("services");

  return (
    <div className="overflow-hidden ">
      <Hero
        title={t("main_title")}
        subtitle=""
        backgroundImage="/servis.png"
        height="500px"
      />

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div className="w-full lg:w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">{t("title")}</h2>

            <p className="text-gray-700 leading-relaxed">{t("description")}</p>
            <div className="h-[85.07px] relative w-full ">
              <Image
                src="/partners.jpg.svg"
                alt="Company partners"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full h-[300px] relative my-8"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/servishero.png"
          alt="Construction site panorama"
          fill
          className="object-cover"
        />
      </motion.div>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div className="w-full lg:w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("tecnologies.title")}
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {[1, 2, 3, 4].map((item) => (
                  <li key={item}>{t(`tecnologies.list.label_${item}`)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("engineering.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("engineering.description")}
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                {t("engineering.list.title")}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                {[1, 2, 3].map((item) => (
                  <li key={item}>{t(`engineering.list.label_${item}`)}</li>
                ))}
              </ul>
            </div>
            <div className="relative w-[600px]  h-[436px]">
              <Image
                src="/servishero5.png"
                alt="Engineering design"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div
            className="w-full hidden md:flex lg:w-1/2 aspect-video relative"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          ></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                {t("delivery.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("delivery.description")}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                {t("experience.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("experience.description")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full md:h-[300px] h-[100px]  relative my-8"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/servishero3.jpg.png"
          alt="Construction site panorama"
          fill
          className="object-contain"
        />
      </motion.div>

      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <motion.div className="w-full hidden md:flex lg:w-1/2"></motion.div>

            <motion.div
              className="w-full lg:w-1/2 space-y-6"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {t("maintenance.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t("maintenance.description")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
