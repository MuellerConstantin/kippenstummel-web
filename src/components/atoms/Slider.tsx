"use client";
import React from "react";
import {
  Slider as AriaSlider,
  SliderProps as AriaSliderProps,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Label } from "./Field";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";

const trackStyles = tv({
  base: "rounded-full",
  variants: {
    orientation: {
      horizontal: "w-full h-[6px]",
      vertical: "h-full w-[6px] ml-[50%] -translate-x-[50%]",
    },
    isDisabled: {
      false: "bg-slate-300 dark:bg-slate-500 forced-colors:bg-[ButtonBorder]",
      true: "bg-slate-100 dark:bg-slate-800 forced-colors:bg-[slateText]",
    },
  },
});

const thumbStyles = tv({
  extend: focusRing,
  base: "w-6 h-6 group-orientation-horizontal:mt-6 group-orientation-vertical:ml-3 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-700 dark:border-slate-300",
  variants: {
    isDragging: {
      true: "bg-slate-700 dark:bg-slate-300 forced-colors:bg-[ButtonBorder]",
    },
    isDisabled: {
      true: "border-slate-300 dark:border-slate-700 forced-colors:border-[slateText]",
    },
  },
});

export interface SliderProps<T> extends AriaSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

export function Slider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: SliderProps<T>) {
  return (
    <AriaSlider
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "orientation-horizontal:grid orientation-vertical:flex orientation-horizontal:w-64 grid-cols-[1fr_auto] flex-col items-center gap-2",
      )}
    >
      <Label>{label}</Label>
      <SliderOutput className="orientation-vertical:hidden text-sm font-medium text-slate-500 dark:text-slate-400">
        {({ state }) =>
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")
        }
      </SliderOutput>
      <SliderTrack className="group orientation-horizontal:h-6 orientation-vertical:w-6 orientation-vertical:h-64 relative col-span-2 flex items-center">
        {({ state, ...renderProps }) => (
          <>
            <div className={trackStyles(renderProps)} />
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                aria-label={thumbLabels?.[i]}
                className={thumbStyles}
              />
            ))}
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}
