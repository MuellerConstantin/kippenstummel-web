import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { ConfirmBottomNavigation } from "../navigation/ConfirmBottomNavigation";
import { GeoCoordinates } from "@/lib/types/geo";
import { useState } from "react";

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
  const [currentPosition, setCurrentPosition] =
    useState<GeoCoordinates>(originalPosition);

  return (
    <>
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
