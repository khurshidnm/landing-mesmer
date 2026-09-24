"use client"

import Image, { type ImageProps } from "next/image"
import { useState, useEffect, useRef } from "react"

interface BlurredImageProps extends ImageProps {
  blurAmount?: number;
}

export default function BlurredImage({
  blurAmount = 10,
  className,
  ...props
}: BlurredImageProps) {
  const isPriority = Boolean(props.priority);
  const [isInView, setIsInView] = useState(isPriority);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPriority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    const currentRef = imageRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, [isPriority]);

  return (
    <div ref={imageRef} className="relative w-full h-full overflow-hidden">
      {isInView && (
        <Image
          {...props}
          loading={isPriority ? undefined : "lazy"}
          className={`
            transition-all duration-700 ease-in-out
            ${!isLoaded ? "scale-105 blur-lg opacity-80" : "scale-100 blur-0 opacity-100"}
            ${className || ""}
          `}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

