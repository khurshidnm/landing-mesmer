import Image from "next/image";
import React from "react";

const Banner = () => {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]">
      <Image
        src="/bilboard.png"
        alt="Bilboard"
        layout="fill"
        objectFit="cover"
        priority
      />
    </div>
  );
};

export default Banner;
