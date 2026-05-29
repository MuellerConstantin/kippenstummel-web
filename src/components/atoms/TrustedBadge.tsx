import type { SVGProps } from "react";

const SEAL_PATH =
  "M12 0.5Q14.485 2.727 17.75 2.041Q18.788 5.212 21.959 6.25" +
  "Q21.273 9.515 23.5 12Q21.273 14.485 21.959 17.75" +
  "Q18.788 18.788 17.75 21.959Q14.485 21.273 12 23.5" +
  "Q9.515 21.273 6.25 21.959Q5.212 18.788 2.041 17.75" +
  "Q2.727 14.485 0.5 12Q2.727 9.515 2.041 6.25" +
  "Q5.212 5.212 6.25 2.041Q9.515 2.727 12 0.5Z";

export interface VerifiedBadgeProps extends SVGProps<SVGSVGElement> {
  size?: number;
  label?: string;
}

export function TrustedBadge({
  size = 20,
  className,
  ...props
}: VerifiedBadgeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={["inline-block shrink-0 text-green-600", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <path d={SEAL_PATH} fill="currentColor" />
      <path
        d="M8.2 12.4L10.8 15.1L15.9 9.2"
        fill="none"
        stroke="#fff"
        strokeWidth={2.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
