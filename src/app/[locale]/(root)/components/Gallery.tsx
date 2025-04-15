"use client";

import { useState } from "react";
import Image from "@/components/BluredImage";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";


export default function Gallery({photos}: {photos: string[]}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("projects")

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Title with left border */}
        <div className="border-l-4 border-blue-600 pl-6 mb-12">
          <h2 className="text-3xl font-bold text-black">{t("gallery")}</h2>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photos?.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-zoom-in ${
                false ? "md:col-span-2" : ""
              }`}
              onClick={() => {
                setPhotoIndex(index +1);
                setIsOpen(true);
                setTimeout(() => {
                  setPhotoIndex(index);
                }, 1000)
              }}
            >
              <div
                className={`relative w-full ${
                  false ? "h-[500px]" : "h-[300px]"
                }`}
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={photo || ""}
                  fill
                  className="object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {isOpen && (
          <Lightbox
            mainSrc={photos[photoIndex]}
            nextSrc={photos[(photoIndex + 1) % photos.length]}
            prevSrc={
              photos[(photoIndex + photos.length - 1) % photos.length]
            }
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + photos.length - 1) % photos.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % photos.length)
            }
            enableZoom={true}
            zoomInLabel="Увеличить"
            zoomOutLabel="Уменьшить"
            closeLabel="Закрыть"
            prevLabel="Предыдущее фото"
            nextLabel="Следующее фото"
          />
        )}
      </div>
    </section>
  );
}
