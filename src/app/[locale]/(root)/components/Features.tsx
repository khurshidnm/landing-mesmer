"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "@/components/BluredImage";
import ImageNext from "next/image";
import { FC, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Certificate } from "@/types/certificates";
import { useLocale, useTranslations } from "next-intl";

const standards = [
  {
    id: 1,
    title: "ISO 14001:2015 – Система экологического менеджмента",
  },
  {
    id: 2,
    title:
      "ISO 45001:2018 – Система менеджмента охраны здоровья и безопасности труда",
  },
  {
    id: 3,
    title: "ISO 9001:2015 – Система менеджмента качества",
  },
];

interface Props {
  certificates: Certificate[]
}

const Advantages: FC<Props> = ({ certificates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const t = useTranslations("home.features");
  const locale = useLocale();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12"
      >
        <div className="flex flex-col mt-5 lg:flex-row justify-between items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-xl sm:text-5xl font-extrabold tracking-wide text-gray-900 mb-6 sm:mb-10">
              {t("title")}
            </h1>
          </div>
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide mb-4 sm:mb-5">
              {t("sub_title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* SLIDER FAOLIYAT */}
      <div className="relative">
        <div className="hidden md:flex space-x-6 overflow-x-auto scroll-hide pb-4">
          {certificates?.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[250px]"
            >
              <div className="relative aspect-[3/4] mb-4">
                <Image
                  src={cert.image}
                  width={300}
                  height={400}
                  alt={cert.ru.title}
                  className="object-contain cursor-pointer"
                  onClick={() => {
                    setPhotoIndex(index);
                    setIsOpen(true);
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">{cert[locale as "ru" | "en" | "uz"].title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
          {certificates?.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              onClick={() => {
                setPhotoIndex(index+1);
                setIsOpen(true);
                setTimeout(() => {
                  setPhotoIndex(index);
                }, 1000)
              }}
            >
              <div className="relative aspect-[3/4] mb-4">
                <Image
                  src={cert.image}
                  width={300}
                  height={400}
                  alt={cert.ru.title}
                  className="object-contain cursor-pointer"
                />
              </div>
              <p className="text-sm text-gray-600">{cert[locale as "ru" | "en" | "uz"]?.title}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={certificates[photoIndex].image}
          nextSrc={certificates[(photoIndex + 1) % certificates.length].image}
          prevSrc={certificates[(photoIndex + certificates.length - 1) % certificates.length].image}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + certificates.length - 1) % certificates.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % certificates.length)}
        />
      )}
    </div>
  );
};

export default Advantages;
