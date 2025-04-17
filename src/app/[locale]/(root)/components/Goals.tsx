"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "@/components/BluredImage";
import { useTranslations } from "next-intl";

const goals = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  img: `/goals/goals${i + 1}.png`,
  animate: [6, 7, 8, 9, 11, 13, 17].includes(i + 1),
}));

const Goals = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  };

  const t = useTranslations("home.goals");

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          {t("description")}
        </p>
      </motion.div>

      <motion.div
        ref={ref}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {goals?.map((goal) => (
          <motion.div
            key={goal.id}
            variants={{
              hidden: { opacity: 0, scale: 0.7 },
              visible: { opacity: 1, scale: 1 },
            }}
            animate={goal.animate ? pulseAnimation : undefined}
            className="relative group"
          >
            <div className="aspect-square rounded-lg overflow-hidden p-[3px]">
              <Image
                src={goal.img}
                alt={`Goal ${goal.id}`}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Goals;
