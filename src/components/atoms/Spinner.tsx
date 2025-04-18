import { useProgressBar } from "react-aria";

export interface SpinnerProps {
  size?: number;
}

export function Spinner(props: SpinnerProps) {
  let { progressBarProps } = useProgressBar({ isIndeterminate: true });

  let center = 16;
  let strokeWidth = 4;
  let r = 16 - strokeWidth;
  let c = 2 * r * Math.PI;
  let percentage = 0.25;
  let offset = c - percentage * c;

  return (
    <svg
      {...progressBarProps}
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth={strokeWidth}
    >
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        className="stroke-green-600"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        transform="rotate(-90 16 16)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          begin="0s"
          dur="1s"
          from="0 16 16"
          to="360 16 16"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
