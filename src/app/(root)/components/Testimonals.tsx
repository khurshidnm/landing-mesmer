"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Что говорят наши клиенты
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 mb-4">
              "Отличный сервис! Очень доволен результатом."
            </p>
            <p className="font-semibold">- Иван Петров</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 mb-4">
              "Профессиональный подход и внимание к деталям."
            </p>
            <p className="font-semibold">- Анна Сидорова</p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="text-gray-600 mb-4">
              "Рекомендую всем! Лучшие в своем деле."
            </p>
            <p className="font-semibold">- Алексей Иванов</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
