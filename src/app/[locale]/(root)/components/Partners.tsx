"use client";

import React from "react";
import Image from "@/components/BluredImage";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const partners = [
  "/partners/siemens.svg",
  "/partners/abb.svg",
  "/partners/andritz.svg",
  "/partners/danfos.svg",
  "/partners/faf.svg",
  "/partners/grundfos.svg",
  "/partners/hawle.svg",
  "/partners/kronhe.svg",
  "/partners/ksb.svg",
  "/partners/kubota.svg",
  "/partners/lutz_jesco.svg",
  "/partners/prominent.svg",
  "/partners/qarmet.svg",
  "/partners/sany.svg",
  "/partners/schneider_electric.svg",
  "/partners/xylem.svg",
  "/partners/sulzer.svg",
  "/partners/weg.svg",
  "/partners/wika.svg",
  "/partners/wilo.svg",
  "/partners/xcmg.svg",
  "/partners/partner22.svg",
  "/partners/partner23.svg",
  "/partners/partner24.svg",
];

const Partners = () => {
  const t = useTranslations("home.partners");
  const [hovered, setHovered] = React.useState(false);
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("trust_us")}
        </h2>
        <div className="overflow-hidden relative">
          <div className={cn("flex min-w-max animate-scroll", hovered && "pause")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {[...partners, ...partners].map((src, index) => (
              <div
                key={index}
                className="w-40 h-40 mx-4 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`Partner logo ${index + 1}`}
                    fill
                    className="object-contain filter !grayscale hover:!grayscale-0 transition-all duration-300"
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
