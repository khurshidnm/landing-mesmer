"use client";

import { motion } from "framer-motion";
import Image from "@/components/BluredImage";
import { type FC, useState, useRef, useEffect } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import type { Certificate } from "@/types/certificates";
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
  certificates: Certificate[];
}

const Advantages: FC<Props> = ({ certificates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("home.features");
  const locale = useLocale();

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - scrollContainer.offsetLeft;
      scrollLeft.current = scrollContainer.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX.current) * 2; // Умножьте на 2 для более быстрого скролла
      scrollContainer.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mousemove", handleMouseMove);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mouseleave", handleMouseUp);

    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

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
            <p className="text-gray-600 leading-relaxed">{t("description")}</p>
          </div>
        </div>
      </motion.div>

      {/* SLIDER FAOLIYAT */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="md:col-span-5 grid grid-cols-1 rounded-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 order-2 w-full"
        >
          {certificates?.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[250px] flex flex-col items-center"
            >
              <div className="flex justify-center items-center mb-2 w-full h-[400px]">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    width={300}
                    height={400}
                    alt={cert[locale as "ru" | "en" | "uz"].title}
                    className="object-contain cursor-pointer h-full w-auto"
                    onClick={() => {
                      setPhotoIndex(index);
                      setIsOpen(true);
                    }}
                  />
                </div>
              <p className="text-sm text-gray-600">
                {cert[locale as "ru" | "en" | "uz"].title}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 mx-auto  justify-center sm:grid-cols-2 gap-6 md:hidden">
          {certificates?.map((cert, index) => (
            <div className="w-full mx-auto" key={cert._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mx-auto"
                onClick={() => {
                  setPhotoIndex(index + 1);
                  setIsOpen(true);
                  setTimeout(() => {
                    setPhotoIndex(index);
                  }, 1000);
                }}
              >
                <div className="relative aspect-[3/4] mb-4 mx-auto">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    width={300}
                    height={400}
                    alt={cert.ru.title}
                    className="object-contain cursor-pointer mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {cert[locale as "ru" | "en" | "uz"]?.title}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={certificates[photoIndex].image}
          nextSrc={certificates[(photoIndex + 1) % certificates.length].image}
          prevSrc={
            certificates[
              (photoIndex + certificates.length - 1) % certificates.length
            ].image
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + certificates.length - 1) % certificates.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % certificates.length)
          }
        />
      )}
    </div>
  );
};

export default Advantages;
