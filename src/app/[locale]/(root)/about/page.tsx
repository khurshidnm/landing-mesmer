"use client";

import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useTranslations } from "next-intl";

const partners = [
  "/our-partners/partner1.svg",
  "/our-partners/partner2.svg",
  "/our-partners/partner3.svg",
  "/our-partners/partner4.svg",
  "/our-partners/partner5.svg",
  "/our-partners/partner6.svg",
  "/our-partners/partner7.svg",
  "/our-partners/partner8.svg",
  "/our-partners/partner9.svg",
  "/our-partners/partner10.svg",
  "/our-partners/partner11.svg",
  "/our-partners/partner12.svg",
  "/our-partners/partner13.svg",
  "/our-partners/partner14.svg",
  "/our-partners/partner15.svg",
  "/our-partners/partner16.svg",
  "/our-partners/partner17.svg",
  "/our-partners/partner18.svg",
  "/our-partners/partner19.svg",
  "/our-partners/partner20.svg",
  "/our-partners/partner21.svg",
  "/partners/norg.svg",
  "/partners/auma.svg",
  "/partners/azertexnolayn.svg",
];

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

  const t = useTranslations("about");

  return (
    <div className="overflow-hidden ">
      <Hero
        title={t("main_title")}
        subtitle=""
        backgroundImage="/about.png"
        height="500px"
      />

      <section className=" px-4 py-5 container mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-12 w-full">
          <motion.div className="w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">{t("title")}</h2>
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/about2.png"
                alt="Company icon"
                fill
                className="object-cover w-full "
              />
            </div>
            <p className="text-gray-700 leading-relaxed">{t("description")}</p>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full aspect-[21/9] relative my-5"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/about3.png"
          alt="Construction site panorama"
          fill
          className="object-cover"
        />
      </motion.div>

      <section className="container mx-auto px-4 ">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div className="w-1/2"></motion.div>

          <motion.div
            className="w-full lg:w-1/2 space-y-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">{t("goals.title")}</h2>
              <div className="relative w-full aspect-[16/9] mb-4">
                <Image
                  src="/about4.png"
                  alt="Goals icon"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-gray-700 leading-relaxed mb-8">
                {t("goals.description")}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("competition.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("competition.description")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="w-full aspect-[21/9] relative my-5"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/about5.png"
          alt="Construction site panorama"
          fill
          className="object-cover"
        />
      </motion.div>

      <section className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div
            className="w-full hidden md:flex lg:w-1/2 aspect-[4/3] relative"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          ></motion.div>

          <motion.div
            className="w-full lg:w-1/2 "
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div>
              <br />
              <br />
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                {t("ethics.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("ethics.description")}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 leading-snug">
                {t("quality.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t("quality.description")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed mb-4">
                {[1, 2, 3, 4].map((item) => (
                  <li key={item}>{t(`quality.list.label_${item}`)}</li>
                ))}
              </ul>
              <p className="text-gray-700 leading-relaxed">
                {t("quality.sub_description")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-5 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <motion.div className="w-1/2"></motion.div>

            <motion.div
              className="w-full lg:w-1/2 space-y-8"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div>
                <h2 className="text-3xl font-bold mb-6">{t("partners.title")}</h2>
                <p className="text-gray-700 leading-relaxed">{t("partners.description")}</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-2 mt-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 border border-collapse rounded-lg overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {partners.map((partner, index) => (
              <div
                key={index}
                className="relative aspect-square border p-4 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner || "/placeholder.svg"}
                    alt={`Partner ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
