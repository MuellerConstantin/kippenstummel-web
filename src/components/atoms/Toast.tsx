import {
  Button,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { X } from "lucide-react";

export interface Toast {
  title: string;
  description?: string | React.ReactNode;
  variant?: "default" | "success" | "error" | "info";
}

export const ToastQueue = AriaToastQueue<Toast>;
export type ToastQueue = AriaToastQueue<Toast>;

const toast = tv({
  base: "flex items-start gap-4 rounded-xl shadow-lg p-4 border w-sm max-w-full transition-all z-[1000]",
  variants: {
    variant: {
      default:
        "bg-white border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100",
      success:
        "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
      error:
        "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
      info: "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100",
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
  base: "text-sm opacity-80 line-clamp-4",
});

const toastCloseButton = tv({
  base: "ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors pointer-cursor",
});

interface ToastRegionProps {
  queue: AriaToastQueue<Toast>;
}

export function ToastRegion({ queue }: ToastRegionProps) {
  return (
    <AriaToastRegion
      queue={queue}
      className="absolute top-0 right-0 flex max-w-full flex-col items-end justify-end gap-4 overflow-hidden p-4"
    >
      {({ toast: t }) => (
        <AriaToast toast={t} className={toast({ variant: t.content.variant })}>
          <AriaToastContent className="flex flex-1 flex-col gap-2 overflow-hidden">
            <Text slot="title" className={toastTitle()}>
              {t.content.title}
            </Text>
            {t.content.description && (
              <Text slot="description" className={toastDescription()}>
                {t.content.description}
              </Text>
            )}
          </AriaToastContent>
          <Button slot="close" className={toastCloseButton()}>
            <X className="h-4 w-4" />
          </Button>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
}
