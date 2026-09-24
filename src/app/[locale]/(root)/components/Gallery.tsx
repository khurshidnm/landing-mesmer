"use client";

import { useState } from "react";
import Image from "@/components/BluredImage";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SimpleLightbox from "@/components/simple-lightbox";


export default function Gallery({
  photos,
  title,
}: {
  photos: string[];
  title?: string;
}) {
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
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            >
              <div
                className={`relative w-full ${
                  false ? "h-[500px]" : "h-[300px]"
                }`}
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`${title || "Water infrastructure"} - construction facility photo ${index + 1}`}
                  fill
                  className="object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <SimpleLightbox
          images={photos}
          index={photoIndex}
          open={isOpen}
          altPrefix={t("gallery")}
          onClose={() => setIsOpen(false)}
          onPrev={() =>
            setPhotoIndex((prev) =>
              photos.length > 0 ? (prev + photos.length - 1) % photos.length : 0
            )
          }
          onNext={() =>
            setPhotoIndex((prev) =>
              photos.length > 0 ? (prev + 1) % photos.length : 0
            )
          }
        />
      </div>
    </section>
  );
}
