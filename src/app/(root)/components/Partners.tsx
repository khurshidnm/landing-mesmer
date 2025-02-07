"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  "/partners/partner (1).svg",
  "/partners/partner (2).svg",
  "/partners/partner (3).svg",
  "/partners/partner (4).svg",
  "/partners/partner (5).svg",
  "/partners/partner (6).svg",
  "/partners/partner (7).svg",
  "/partners/partner (8).svg",
  "/partners/partner (9).svg",
  "/partners/partner (10).svg",
];

const Partners = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Нам доверяют
        </motion.h2>
        <div className="overflow-hidden relative mix-blend-darken">
          <motion.div
            className="flex flex-nowrap min-w-max"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...partners, ...partners].map((src, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-28 h-28 mx-4 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`Partner logo ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
