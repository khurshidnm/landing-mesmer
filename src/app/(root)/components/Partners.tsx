"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  "/partners/partner (1).png",
  "/partners/partner (2).png",
  "/partners/partner (3).png",
  "/partners/partner (4).png",
  "/partners/partner (5).png",
  "/partners/partner (6).png",
  "/partners/partner (7).png",
  "/partners/partner (8).png",
  "/partners/partner (9).png",
  "/partners/partner (10).png",
];

const PartnersCarousel = () => {
  return (
    <div className="overflow-hidden py-4">
      <motion.div
        className="flex space-x-8"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          x: {
            repeat: Infinity,
            ease: "linear",
            duration: 15,
          },
        }}
      >
        {[...partners, ...partners].map((src, index) => (
          <div key={index} className="w-32 h-20 flex-shrink-0 relative">
            <Image
              src={src}
              alt="Partner Logo"
              fill
              className="object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default PartnersCarousel;
