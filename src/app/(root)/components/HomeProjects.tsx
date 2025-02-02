"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectsSection = () => {
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

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
      >
        {/* Left Column */}
        <motion.div variants={fadeInUp}>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">ПРОЕКТЫ</h1>
        </motion.div>

        {/* Right Column */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col justify-between"
        >
          <div className="space-y-8">
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl leading-relaxed"
            >
              Мы — инновационная компания, демонстрирующая наши идеи для того,
              чтобы помочь нашим клиентам работать с беспрецедентной и
              устойчивой производительностью и результатами в своих
              предприятиях.
            </motion.p>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src="/projects.png"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>

            <motion.p
              variants={fadeInUp}
              className="text-gray-600 leading-relaxed"
            >
              Как ответственная компания, мы обязуемся нести социальную
              ответственность в нашей деятельности и заботиться о сообществах, в
              которых мы работаем.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg text-lg font-medium transition-colors duration-300"
              onClick={() => (window.location.href = "/projects")}
            >
              ВСЕ ПРОЕКТЫ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
