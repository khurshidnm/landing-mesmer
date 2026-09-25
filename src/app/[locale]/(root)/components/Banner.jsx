import Image from "@/components/BluredImage";
import React from "react";

// Brand billboard photo, framed like the other content images
const Banner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-[21/9]">
        <Image
          src="/bilboard.png"
          alt="MESMER Engineering — building the future today"
          fill
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover object-[center_25%]"
        />
      </div>
    </div>
  );
};

export default Banner;
