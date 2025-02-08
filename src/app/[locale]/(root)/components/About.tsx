"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import Image from "@/components/BluredImage";

const AboutCompany = () => {
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
  };

  const stats = [
    { number: 750, label: "ПЕРСОНАЛ", sublabel: "ЧЕЛОВЕК" },
    { number: 59, label: "ПРОЕКТЫ", sublabel: "И БОЛЬШЕ" },
    { number: 20, label: "ПОСТАВЩИКИ", sublabel: "И БОЛЬШЕ" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-12"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-gray-900 mb-6 sm:mb-10">
              О КОМПАНИИ
            </h1>
          </div>
          <div className="space-y-6 max-w-2xl">
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide mb-4 sm:mb-5">
                Наша ключевая задача – быть признанными нашими клиентами, хорошо
                зарекомендовав себя в качестве надежного EPC
              </h2>
              <p className="text-gray-600 leading-relaxed">
                (Инжиниринг, Снабжение и Строительство) подрядчика в сфере
                строительных услуг и получение международного признания, как
                надежного поставщика высококачественного оборудования. Учитывая
                наши достижения, компания "MESMER" стремится расширить сферу
                своей деятельности в соседних странах, таких как Таджикистан и
                Кыргызстан
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="text-center"
          >
            <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
              {inView && (
                <CountUp
                  start={0}
                  end={stat.number}
                  duration={2.5}
                  separator=","
                />
              )}
            </div>
            <div className="text-gray-800 font-medium">{stat.label}</div>
            <div className="text-gray-500 text-sm">{stat.sublabel}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            src: "/work1.png",
            alt: "Construction workers",
          },
          {
            src: "/work2.png",
            alt: "Team collaboration",
          },
          {
            src: "/work3.png",
            alt: "Business handshake",
          },
        ].map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative h-64 overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-12"
      >
        <div className="flex flex-col mt-5 lg:flex-row justify-between items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-0">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-gray-900 mb-6 sm:mb-10"></h1>
          </div>
          <div className="space-y-6 max-w-2xl">
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-wide mb-4 sm:mb-5">
                Наша миссия - оставаться ведущей многопрофильной компанией
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Развивая долгосрочные партнерские взаимоотношения с клиентами по
                всему миру, предоставляя инновационные решения, отвечающие
                мировым стандартам услуг и высококачественную продукцию,
                максимальную эффективность, большой технический опыт и
                максимальную пользу от инвестиций.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutCompany;
