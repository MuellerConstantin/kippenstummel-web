"use client";

import { useEffect, useRef } from "react";
import * as jdenticon from "jdenticon";

interface IdentIconProps {
  value: string;
  className?: string;
}

export function IdentIcon({ value, className }: IdentIconProps) {
  const icon = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (icon.current) {
      jdenticon.update(icon.current, value);
    }
  }, [value]);

  return (
    <svg
      data-jdenticon-value={value}
      ref={icon}
      height="auto"
      width="auto"
      className={`relative h-full w-full bg-gray-100 dark:bg-gray-800 ${className}`}
    />
  );
}
