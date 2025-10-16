"use client";

import { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";

interface IdentIconProps {
  value: string;
  className?: string;
}

export function IdentIcon({ value, className }: IdentIconProps) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    const avatar = createAvatar(thumbs, {
      seed: value,
      backgroundColor: ["84cc16"],
      shapeColor: ["16a34a"],
      scale: 75,
    });

    let svgString = avatar.toString();
    svgString = svgString
      .replace(/width="[^"]*"/, 'width="100%"')
      .replace(/height="[^"]*"/, 'height="100%"');

    setSvg(svgString);
  }, [value]);

  return (
    <div
      className={`relative h-full w-full ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
