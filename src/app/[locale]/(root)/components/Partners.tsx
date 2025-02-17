"use client";

import React from "react";
import Image from "@/components/BluredImage";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

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
  const t = useTranslations("home.partners");
  const [hovered, setHovered] = React.useState(false);
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("trust_us")}
        </h2>
        <div className="overflow-hidden relative">
          <div className={cn("flex min-w-max animate-scroll", hovered && "pause")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {[...partners, ...partners].map((src, index) => (
              <div
                key={index}
                className="w-28 h-28 mx-4 flex items-center justify-center"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
