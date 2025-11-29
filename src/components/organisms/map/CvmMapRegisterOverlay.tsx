import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { ConfirmBottomNavigation } from "../navigation/ConfirmBottomNavigation";
import { GeoCoordinates } from "@/lib/types/geo";
import { useState } from "react";
import { useTranslations } from "next-intl";

export interface CvmMapRegisterOverlayProps {
  originalPosition: GeoCoordinates;
  onRegister?: (newPosition: GeoCoordinates) => void;
  onCancel?: () => void;
}

export function CvmMapRegisterOverlay({
  originalPosition,
  onRegister,
  onCancel,
}: CvmMapRegisterOverlayProps) {
  const t = useTranslations("CvmMapRegisterOverlay");

  const [currentPosition, setCurrentPosition] =
    useState<GeoCoordinates>(originalPosition);

  return (
    <>
      <div className="absolute top-2.5 left-1/2 z-[2000] w-fit -translate-x-1/2 px-2">
        <div className="mx-auto h-full max-w-fit rounded-md bg-white px-2 py-1 text-slate-900 shadow-[0_0_0_2px_#0000001a] dark:bg-slate-900 dark:text-white dark:shadow-[0_0_0_2px_#ffffff1a]">
          <div className="w-full font-semibold text-nowrap">
            {t("description")}
          </div>
        </div>
      </div>
      <AdjustableLocationMarker
        reference={{
          position: originalPosition,
          maxDistance: 25,
        }}
        position={currentPosition}
        onAdapt={setCurrentPosition}
      />
      <ConfirmBottomNavigation
        onCancel={onCancel}
        onConfirm={() => onRegister?.(currentPosition)}
      />
    </>
  );
}
