"use client";

import React from "react";
import Image from "@/components/BluredImage";
import { useLocale, useTranslations } from "next-intl";
import { t as cmsText } from "@/lib/cms/definitions";
import type { HomeContent, PartnerEntry } from "@/lib/cms/content-types";
import { cn } from "@/lib/utils";

const DEFAULT_LOGOS = [
  "/partners/uzsuv.svg",
  "/partners/adb.svg",
  "/partners/wb.svg",
  "/partners/siemens.svg",
];

// Logos from Website Content → Partners (those marked "Show in the home page strip")
const Partners = ({ content, partners: partnerEntries }: { content?: HomeContent; partners?: PartnerEntry[] }) => {
  const tr = useTranslations("home.partners");
  const locale = useLocale();
  const title = cmsText(content?.partners_title, locale) || tr("trust_us");
  const partners = partnerEntries
    ? partnerEntries.map((p) => ({ src: p.logo, name: p.name }))
    : DEFAULT_LOGOS.map((src) => ({ src, name: "" }));
  const [hovered, setHovered] = React.useState(false);
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {title}
        </h2>
        <div className="overflow-hidden relative">
          <div className={cn("flex min-w-max animate-scroll", hovered && "pause")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="w-40 h-40 mx-4 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.src}
                    alt={partner.name || `Partner logo ${index + 1}`}
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
