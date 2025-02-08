"use client"

import Image, { type ImageProps } from "next/image"
import { useState, useEffect, useRef } from "react"

interface BlurredImageProps extends ImageProps {
  blurAmount?: number
}

export default function BlurredImage({ blurAmount = 10, className, ...props }: BlurredImageProps) {
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        })
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      },
    )

    const currentRef = imageRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <div ref={imageRef} className="relative w-full h-full">
      {isInView && (
        <Image
          {...props}
          loading="lazy"
          className={`
            duration-700 ease-in-out
            ${!isLoaded ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"}
            ${className || ""}
          `}
          onLoadingComplete={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}

