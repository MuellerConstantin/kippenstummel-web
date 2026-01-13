import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { ConfirmBottomNavigation } from "../../navigation/ConfirmBottomNavigation";
import { GeoCoordinates } from "@/lib/types/geo";
import { useTranslations } from "next-intl";
import { useCvmMapRepositionView } from "@/contexts/CvmMapViewContext";
import { MapPinned } from "lucide-react";

export interface CvmMapRepositionOverlayProps {
  onReposition?: (
    newPosition: GeoCoordinates,
    editorPosition: GeoCoordinates,
  ) => void;
  onCancel?: () => void;
}

export function CvmMapRepositionOverlay({
  onReposition,
  onCancel,
}: CvmMapRepositionOverlayProps) {
  const t = useTranslations("CvmMapRepositionOverlay");

  const { state, adaptRepositionCurrentPosition } = useCvmMapRepositionView();

  return (
    <>
      <div className="absolute top-2.5 left-1/2 z-[2000] w-fit -translate-x-1/2 px-2">
        <div className="mx-auto flex h-full max-w-fit gap-2 rounded-md bg-white px-2 py-1 text-slate-900 shadow-[0_0_0_2px_#0000001a] dark:bg-slate-900 dark:text-white dark:shadow-[0_0_0_2px_#ffffff1a]">
          <MapPinned className="h-5 w-5 text-green-600" />
          <div className="w-full font-semibold text-nowrap">
            {t("description")}
          </div>
        </div>
      </div>
      <AdjustableLocationMarker
        reference={{
          position: state.originalPosition!,
          maxDistance: 25,
        }}
        position={state.currentPosition!}
        onAdapt={adaptRepositionCurrentPosition}
      />
      <div className="pointer-events-auto absolute bottom-14 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2 sm:bottom-9 lg:bottom-8">
        <ConfirmBottomNavigation
          onCancel={onCancel}
          onConfirm={() =>
            onReposition?.(state.currentPosition!, state.editorPosition!)
          }
        />
      </div>
    </>
  );
}
