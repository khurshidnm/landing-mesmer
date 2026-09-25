"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import Image from "@/components/BluredImage";
import SimpleLightbox from "@/components/simple-lightbox";
import type { Certificate } from "@/types/certificates";

type Locale = "en" | "ru" | "uz";

/** "ISO 9001:2015 – Quality Management System" → ["ISO 9001:2015", "Quality Management System"] */
function splitTitle(title: string): [string, string] {
  const match = title.match(/^(.+?)\s+[–—-]\s+(.+)$/);
  return match ? [match[1], match[2]] : ["", title];
}

export default function CertificatesGrid({
  certificates,
  locale,
  viewLabel,
}: {
  certificates: Certificate[];
  locale: Locale;
  viewLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const images = certificates.map((c) => c.image || "/placeholder.svg");
  const count = certificates.length;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => {
          const title = cert[locale]?.title || cert.en?.title || "";
          const [standard, name] = splitTitle(title);
          return (
            <button
              key={cert._id}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-[420px] w-full bg-gray-50 p-6">
                <Image
                  src={images[i]}
                  width={320}
                  height={440}
                  alt={title}
                  className="mx-auto block h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 border-t border-gray-100 p-5">
                {standard && (
                  <span className="w-fit rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold tracking-wide text-blue-700">
                    {standard}
                  </span>
                )}
                <h3 className="text-base font-semibold leading-snug text-gray-950">{name}</h3>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  <Maximize2 className="h-4 w-4" /> {viewLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <SimpleLightbox
        images={images}
        index={index}
        open={open}
        altPrefix={viewLabel}
        onClose={() => setOpen(false)}
        onPrev={() => setIndex((p) => (p + count - 1) % count)}
        onNext={() => setIndex((p) => (p + 1) % count)}
      />
    </>
  );
}
