import { useCallback, useRef, useState } from "react";
import {
  MapPinPlus,
  LoaderCircle,
  SlidersVertical,
  HelpCircle,
} from "lucide-react";
import useLocate from "@/hooks/useLocate";
import { useAppSelector } from "@/store";
import { GeoCoordinates } from "@/lib/types/geo";

interface MenuBottomNavigationProps {
  onRegister?: (position: GeoCoordinates) => void;
  onHelp?: () => void;
  onFilter?: () => void;
}

export function MenuBottomNavigation(props: MenuBottomNavigationProps) {
  const { onRegister, onHelp, onFilter } = props;
  const locate = useLocate();
  const containerRef = useRef<HTMLDivElement>(null);

  const numberOfActiveFilters = useAppSelector((state) => {
    let count = 0;
    if (state.usability.mapFilters?.score) count += 1;
    return count;
  });

  const [registeringCvm, setRegisteringCvm] = useState<boolean>(false);

  const onRegisterCvm = useCallback(() => {
    setRegisteringCvm(true);

    locate()
      .then((position) => onRegister?.(position))
      .finally(() => {
        setRegisteringCvm(false);
      });
  }, [locate, onRegister]);

  return (
    <div className="h-16 w-full cursor-default">
      <div
        ref={containerRef}
        className="mx-auto grid h-full max-w-fit grid-cols-3 rounded-md border border-white/20 bg-white/70 text-slate-900 shadow-[0_0_0_2px_#0000001a] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:shadow-[0_0_0_2px_#ffffff1a]"
      >
        <button
          type="button"
          onClick={() => onHelp?.()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-l-md px-5 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onRegisterCvm}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-green-600 font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none dark:focus:ring-green-800"
          >
            {registeringCvm ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-white" />
            ) : (
              <MapPinPlus className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={() => onFilter?.()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-r-md px-5 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div className="relative">
            {!!numberOfActiveFilters && (
              <div className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 p-1">
                <span className="text-[10px] text-white">
                  {numberOfActiveFilters >= 10 ? "9+" : numberOfActiveFilters}
                </span>
              </div>
            )}
            <SlidersVertical className="h-6 w-6" />
          </div>
        </button>
      </div>
    </div>
  );
}
