import React from "react";
import {
  ModalOverlay,
  ModalOverlayProps,
  Modal as RACModal,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export function Modal(
  props: ModalOverlayProps & { placement?: "center" | "bottom" },
) {
  const isBottom = props.placement === "bottom";

  const overlayStyles = tv({
    base: "fixed top-0 left-0 w-full h-full isolate z-[2000] bg-black/[15%] p-4 backdrop-blur-none",
    variants: {
      isEntering: {
        true: "animate-in fade-in duration-200 ease-out",
      },
      isExiting: {
        true: "animate-out fade-out duration-200 ease-in",
      },
      isBottom: {
        true: "flex items-end justify-center",
        false: "flex items-center justify-center",
      },
    },
  });

  const modalStyles = tv({
    base: "w-full max-w-md max-h-full overflow-scroll h-fit rounded-2xl bg-white dark:bg-slate-800/70 dark:backdrop-blur-2xl dark:backdrop-saturate-200 forced-colors:bg-[Canvas] text-left align-middle text-slate-700 dark:text-slate-300 shadow-2xl bg-clip-padding border border-black/10 dark:border-white/10",
    variants: {
      isEntering: {
        true: "animate-in zoom-in-105 ease-out duration-200",
      },
      isExiting: {
        true: "animate-out zoom-out-95 ease-in duration-200",
      },
    },
  });

  return (
    <ModalOverlay
      {...props}
      className={(renderProps) => overlayStyles({ ...renderProps, isBottom })}
    >
      <RACModal
        {...props}
        className={composeRenderProps(
          props.className,
          (className, renderProps) =>
            modalStyles({ ...renderProps, className }),
        )}
      />
    </ModalOverlay>
  );
}
