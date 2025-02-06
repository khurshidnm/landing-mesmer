"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { motion } from "framer-motion";

const photos = [
  {
    id: 1,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bBorrbc4XLZVZVo3fq8vUTIemWQfT7.png",
    width: 600,
    height: 400,
    alt: "Строительные работы",
    size: "large",
  },
  {
    id: 2,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bBorrbc4XLZVZVo3fq8vUTIemWQfT7.png",
    width: 400,
    height: 300,
    alt: "Инспекция объекта",
    size: "medium",
  },
  {
    id: 3,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bBorrbc4XLZVZVo3fq8vUTIemWQfT7.png",
    width: 400,
    height: 300,
    alt: "Рабочий процесс",
    size: "medium",
  },
  {
    id: 4,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bBorrbc4XLZVZVo3fq8vUTIemWQfT7.png",
    width: 400,
    height: 300,
    alt: "Строительная площадка",
    size: "medium",
  },
];

export default function Gallery() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Title with left border */}
        <div className="border-l-4 border-blue-600 pl-6 mb-12">
          <h2 className="text-3xl font-bold text-black">ГАЛЕРЕЯ</h2>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-zoom-in ${
                photo.size === "large" ? "md:col-span-2" : ""
              }`}
              onClick={() => {
                setPhotoIndex(index);
                setIsOpen(true);
              }}
            >
              <div
                className={`relative w-full ${
                  photo.size === "large" ? "h-[500px]" : "h-[300px]"
                }`}
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
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
            mainSrc={photos[photoIndex].src}
            nextSrc={photos[(photoIndex + 1) % photos.length].src}
            prevSrc={
              photos[(photoIndex + photos.length - 1) % photos.length].src
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
