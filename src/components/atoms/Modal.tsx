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
    base: "w-full max-w-md max-h-full overflow-scroll h-fit bg-white dark:bg-slate-800/70 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10",
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
