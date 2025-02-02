"use client";
import Image from "next/image";
import { motion } from "framer-motion";

import partner1 from "../../../../public/partners/partner (1).png";
import partner2 from "../../../../public/partners/partner (2).png";
import partner3 from "../../../../public/partners/partner (3).png";
import partner4 from "../../../../public/partners/partner (4).png";
import partner5 from "../../../../public/partners/partner (5).png";
import partner6 from "../../../../public/partners/partner (6).png";
import partner7 from "../../../../public/partners/partner (7).png";
import partner8 from "../../../../public/partners/partner (8).png";
import partner9 from "../../../../public/partners/partner (9).png";
import partner10 from "../../../../public/partners/partner (10).png";

const partners = [
  partner1,
  partner2,
  partner3,
  partner4,
  partner5,
  partner6,
  partner7,
  partner8,
  partner9,
  partner10,
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
