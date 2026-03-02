"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface SimpleLightboxProps {
  images: string[];
  index: number;
  open: boolean;
  altPrefix?: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function SimpleLightbox({
  images,
  index,
  open,
  altPrefix = "Image",
  onClose,
  onPrev,
  onNext,
}: SimpleLightboxProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && images.length > 1) onPrev();
      if (event.key === "ArrowRight" && images.length > 1) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose, onNext, onPrev, open]);

  if (!open || images.length === 0) return null;

  const safeIndex = ((index % images.length) + images.length) % images.length;
  const currentImage = images[safeIndex] || "/placeholder.svg";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        aria-label="Close image preview"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <div
        className="flex max-h-[85vh] max-w-6xl items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={currentImage}
          alt={`${altPrefix} ${safeIndex + 1}`}
          className="max-h-[85vh] max-w-full object-contain"
        />
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {safeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
