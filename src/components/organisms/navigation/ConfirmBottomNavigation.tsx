import { Check, X } from "lucide-react";

interface ConfirmBottomNavigationProps {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmBottomNavigation(props: ConfirmBottomNavigationProps) {
  const { onConfirm, onCancel } = props;

  return (
    <div className="absolute bottom-9 left-1/2 z-[2000] h-16 w-full -translate-x-1/2 px-2 xl:bottom-3">
      <div className="mx-auto grid h-full max-w-fit grid-cols-2 rounded-md bg-white text-slate-900 shadow-[0_0_0_2px_#0000001a] dark:bg-slate-900 dark:text-white dark:shadow-[0_0_0_2px_#ffffff1a]">
        <button
          type="button"
          onClick={() => onCancel?.()}
          className="group inline-flex cursor-pointer flex-col items-center justify-center rounded-l-md px-5 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-green-600 dark:hover:bg-slate-800"
        >
          <X className="h-6 w-6 text-red-600" />
        </button>
        <button
          type="button"
          onClick={() => onConfirm?.()}
          className="group inline-flex cursor-pointer flex-col items-center justify-center rounded-r-md px-5 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-green-600 dark:hover:bg-slate-800"
        >
          <Check className="h-6 w-6 text-green-600" />
        </button>
      </div>
    </div>
  );
}
