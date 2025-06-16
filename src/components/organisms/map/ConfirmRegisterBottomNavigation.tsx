import { Check, X } from "lucide-react";

interface ConfirmRegisterBottomNavigationProps {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmRegisterBottomNavigation(
  props: ConfirmRegisterBottomNavigationProps,
) {
  const { onConfirm, onCancel } = props;

  return (
    <div className="absolute bottom-6 left-1/2 z-[2000] h-16 w-full -translate-x-1/2 px-2">
      <div className="mx-auto grid h-full max-w-fit grid-cols-2 rounded-md border-2 border-slate-400 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
        <button
          type="button"
          onClick={() => onCancel?.()}
          className="group inline-flex cursor-pointer flex-col items-center justify-center rounded-l-md px-5 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <X className="h-6 w-6 text-red-600" />
        </button>
        <button
          type="button"
          onClick={() => onConfirm?.()}
          className="group inline-flex cursor-pointer flex-col items-center justify-center rounded-r-md px-5 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Check className="h-6 w-6 text-green-500" />
        </button>
      </div>
    </div>
  );
}
