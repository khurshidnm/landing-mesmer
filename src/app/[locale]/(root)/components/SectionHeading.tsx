import type { ReactNode } from "react";

/**
 * Section header used across the site: small blue label, heading, and an
 * optional intro text (right column on desktop) or action link.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "split",
  size = "lg",
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "split" | "center";
  /** "md" for headings that are a full sentence */
  size?: "lg" | "md";
  className?: string;
}) {
  const titleClass =
    size === "md" ? "text-xl font-bold leading-snug text-gray-950 sm:text-2xl" : "text-2xl font-bold leading-tight text-gray-950 sm:text-3xl md:text-4xl";
  if (align === "center") {
    return (
      <div className={`mx-auto mb-10 max-w-3xl text-center ${className}`}>
        {eyebrow && <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</span>}
        <h2 className={titleClass}>{title}</h2>
        {description && <p className="mt-4 leading-relaxed text-gray-600">{description}</p>}
      </div>
    );
  }
  return (
    <div className={`mb-10 flex flex-col justify-between gap-6 border-b border-gray-100 pb-8 lg:flex-row lg:items-end lg:gap-16 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</span>}
        <h2 className={titleClass}>{title}</h2>
      </div>
      {(description || action) && (
        <div className="flex max-w-md shrink-0 flex-col gap-3 lg:items-end lg:text-right">
          {description && <p className="text-sm leading-relaxed text-gray-600 lg:text-left">{description}</p>}
          {action}
        </div>
      )}
    </div>
  );
}
