"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const certificates = [
  {
    id: 1,
    image: "/setifikat1.png",
    title: "ISO 14001:2015 – Система экологического менеджмента",
  },
  {
    id: 2,
    image: "/setifikat2.png",
    title: "ISO 14001:2015 – Система экологического менеджмента",
  },
  {
    id: 3,
    image: "/setifikat3.png",
    title: "ISO 14001:2015 – Система экологического менеджмента",
  },
  {
    id: 4,
    image: "/setifikat4.png",
    title: "ISO 14001:2015 – Система экологического менеджмента",
  },
];

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

const Advantages = () => {
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [certificatesRef, certificatesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [standardsRef, standardsInView] = useInView({
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
  };
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        ref={headerRef}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="mb-12 flex flex-col md:flex-row items-start justify-between"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8 md:mb-0">
          ПРЕИМУЩЕСТВО
        </h1>
        <div className="space-y-6 md:space-y-0 md:w-2/3">
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-semibold mb-4">Наши достоинства</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              Мы - динамично развивающаяся компания, которая придерживается
              основных принципов безопасности, командной работы и поддержания
              высокой репутации. Инновационные решения, предоставляемые нашей
              компанией, являются гарантом своевременного качественного и
              безопасного выполнения проектов, обеспечивая при этом защиту
              окружающей среды.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        ref={certificatesRef}
        initial="hidden"
        animate={certificatesInView ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16"
      >
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative aspect-[3/4] mb-4">
              <Image
                src={cert.image}
                width={300}
                height={400}
                alt={cert.title}
                className="object-contain cursor-pointer"
                onClick={() => {
                  setPhotoIndex(index);
                  setIsOpen(true);
                }}
              />
            </div>
            <p className="text-sm text-gray-600">{cert.title}</p>
          </motion.div>
        ))}
      </motion.div>

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

      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Левая пустая часть */}
          <div className="hidden md:block"></div>

          {/* Правая часть с содержимым */}
          <div className="flex flex-col items-start space-y-6">
            <motion.div
              ref={contentRef}
              initial="hidden"
              animate={contentInView ? "visible" : "hidden"}
              variants={fadeInUp}
            >
              <p className="text-gray-800 leading-relaxed max-w-md font-bold">
                Компания «MESMER» обладает рядом престижных международных и
                национальных сертификатов, подтверждающих её соответствие
                высоким стандартам управления качеством, экологическими нормами
                и охраной труда. Среди них:
              </p>
            </motion.div>

            <motion.div
              ref={standardsRef}
              initial="hidden"
              animate={standardsInView ? "visible" : "hidden"}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
              }}
              className="space-y-3"
            >
              {standards.map((standard) => (
                <motion.div
                  key={standard.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-start space-x-3"
                >
                  <Image src="/ptichka.svg" alt="" width={20} height={20} />
                  <span className="text-gray-700">{standard.title}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial="hidden"
              animate={standardsInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="mt-6 text-gray-600 italic max-w-md"
            >
              Эти сертификаты подтверждают приверженность компании лучшим
              мировым и национальным практикам, обеспечивая клиентам и партнерам
              уверенность в надежности и качестве предоставляемых услуг.
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Advantages;
