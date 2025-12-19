import {
  Button,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  QueuedToast,
} from "react-aria-components";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { tv } from "tailwind-variants";
import { X } from "lucide-react";

export interface Toast {
  title: string;
  description?:
    | string
    | React.ReactNode
    | ((props: { close: () => void }) => React.ReactNode);
  variant?: "default" | "success" | "error" | "info" | "warning";
}

export const ToastQueue = AriaToastQueue<Toast>;
export type ToastQueue = AriaToastQueue<Toast>;

const toast = tv({
  base: "flex items-start gap-4 rounded-xl shadow-lg p-4 border w-xs lg:w-sm transition-all z-[150000]",
  variants: {
    variant: {
      default:
        "bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100",
      success:
        "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
      error:
        "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
      info: "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100",
      warning:
        "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const toastTitle = tv({
  base: "font-semibold text-base truncate",
});

const toastDescription = tv({
  base: "text-sm opacity-80 max-h-24 overflow-y-auto",
});

const toastCloseButton = tv({
  base: "ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors pointer-cursor",
});

interface ToastRegionProps {
  queue: AriaToastQueue<Toast>;
}

function Toast({
  toast: t,
  queue,
}: {
  toast: QueuedToast<Toast>;
  queue: AriaToastQueue<Toast>;
}) {
  const x = useMotionValue(0);
  const close = () => queue.close(t.key);

  return (
    <motion.div
      key={t.key}
      layout
      drag="x"
      style={{ x }}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ right: 0.8 }}
      onDragEnd={(_, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset > 100 || velocity > 1000) {
          queue.close(t.key);
          return;
        }
      }}
    >
      <AriaToast
        toast={t}
        className={`${toast({ variant: t.content.variant })} pointer-events-auto`}
      >
        <AriaToastContent className="flex flex-1 flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <Text slot="title" className={toastTitle()}>
              {t.content.title}
            </Text>
            <Button
              slot="close"
              className={`${toastCloseButton()} cursor-pointer`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {t.content.description && (
            <Text slot="description" className={toastDescription()}>
              {typeof t.content.description === "function"
                ? t.content.description({ close })
                : t.content.description}
            </Text>
          )}
        </AriaToastContent>
      </AriaToast>
    </motion.div>
  );
}

export function ToastRegion({ queue }: ToastRegionProps) {
  return (
    <AnimatePresence initial={false}>
      <AriaToastRegion
        queue={queue}
        className="pointer-events-none fixed inset-y-0 right-0 z-[150000] flex max-h-screen max-w-full flex-col items-end gap-4 overflow-x-hidden overflow-y-auto p-4"
      >
        {({ toast: t }) => <Toast key={t.key} toast={t} queue={queue} />}
      </AriaToastRegion>
    </AnimatePresence>
  );
}
