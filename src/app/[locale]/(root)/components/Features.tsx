"use client";

import { motion } from "framer-motion";
import Image from "@/components/BluredImage";
import { type FC, useState, useRef, useEffect } from "react";
import type { Certificate } from "@/types/certificates";
import { useLocale, useTranslations } from "next-intl";
import { t as cmsText } from "@/lib/cms/definitions";
import type { HomeContent } from "@/lib/cms/content-types";

import SimpleLightbox from "@/components/simple-lightbox";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

const ALL = { en: "All certificates", ru: "Все сертификаты", uz: "Barcha sertifikatlar" } as const;

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
  content?: HomeContent;
}

const Advantages: FC<Props> = ({ certificates, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const certificateImages = certificates.map(
    (certificate) => certificate.image || "/placeholder.svg"
  );

  const tr = useTranslations("home.features");
  const locale = useLocale();
  const t = (key: string) => {
    const field = { title: "advantages_title", sub_title: "advantages_subtitle", description: "advantages_description" }[key];
    return (field && cmsText(content?.[field as keyof HomeContent] as Record<string, string>, locale)) || tr(key);
  };

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
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow={t("title")}
        title={t("sub_title")}
        description={t("description")}
        action={
          <Link href={`/${locale}/certificates`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            {ALL[locale as keyof typeof ALL] || ALL.en} →
          </Link>
        }
      />

      {/* SLIDER FAOLIYAT */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="hidden md:grid md:col-span-5 rounded-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 order-2 w-full"
        >
          {certificates?.map((cert, index) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex min-w-[250px] flex-col items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="flex h-[400px] w-full items-center justify-center bg-gray-50 p-5">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    width={300}
                    height={400}
                    alt={cert[locale as "ru" | "en" | "uz"].title}
                    className="object-contain cursor-pointer h-full w-auto mx-auto block"
                    onClick={() => {
                      setPhotoIndex(index);
                      setIsOpen(true);
                    }}
                  />
                </div>
              <p className="w-full border-t border-gray-100 px-5 py-4 text-center text-sm font-medium text-gray-800">
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
                className="mx-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                onClick={() => {
                  setPhotoIndex(index);
                  setIsOpen(true);
                }}
              >
                <div className="relative aspect-[3/4] mb-4 mx-auto">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    width={300}
                    height={400}
                    alt={cert.ru.title}
                    className="object-contain cursor-pointer mx-auto block"
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

      <SimpleLightbox
        images={certificateImages}
        index={photoIndex}
        open={isOpen}
        altPrefix={t("title")}
        onClose={() => setIsOpen(false)}
        onPrev={() =>
          setPhotoIndex((prev) =>
            certificates.length > 0
              ? (prev + certificates.length - 1) % certificates.length
              : 0
          )
        }
        onNext={() =>
          setPhotoIndex((prev) =>
            certificates.length > 0 ? (prev + 1) % certificates.length : 0
          )
        }
      />
    </div>
  );
};

export default Advantages;
