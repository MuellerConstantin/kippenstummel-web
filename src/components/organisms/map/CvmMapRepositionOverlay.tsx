import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { ConfirmBottomNavigation } from "../navigation/ConfirmBottomNavigation";
import { GeoCoordinates } from "@/lib/types/geo";
import { useState } from "react";

export interface CvmMapRepositionOverlayProps {
  originalPosition: GeoCoordinates;
  onReposition?: (newPosition: GeoCoordinates) => void;
  onCancel?: () => void;
}

export function CvmMapRepositionOverlay({
  originalPosition,
  onReposition,
  onCancel,
}: CvmMapRepositionOverlayProps) {
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
        onConfirm={() => onReposition?.(currentPosition)}
      />
    </>
  );
}
