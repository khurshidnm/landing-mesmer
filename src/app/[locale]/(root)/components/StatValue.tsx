"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Animates the number inside values like "20+", "1.5M+", "2,000+ km" or
// "500,000+ m³/day" when it scrolls into view, keeping the surrounding text.
export default function StatValue({
  value,
  duration = 1.5,
  unitClassName,
}: {
  value: string;
  duration?: number;
  /** Optional styling for a trailing unit such as "km" or "m³/day" */
  unitClassName?: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);

  if (!match) return <span>{value}</span>;
  const [, prefix, number, suffix] = match;
  const end = parseFloat(number.replace(/,/g, ""));
  const decimals = number.includes(".") ? number.split(".")[1].length : 0;

  return (
    <span ref={ref}>
      {prefix}
      {inView ? (
        <CountUp start={0} end={end} decimals={decimals} duration={duration} separator={number.includes(",") ? "," : ""} />
      ) : (
        number
      )}
      {unitClassName && /^\S*\s/.test(suffix) ? (
        <>
          {suffix.match(/^\S*/)?.[0]}
          <span className={unitClassName}>{suffix.replace(/^\S*/, "")}</span>
        </>
      ) : (
        suffix
      )}
    </span>
  );
}
