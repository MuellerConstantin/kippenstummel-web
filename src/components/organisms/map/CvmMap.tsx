"use client";

import { GeoCoordinates } from "@/lib/types/geo";
import { CvmMapViewProvider } from "@/contexts/CvmMapViewContext";
import { CvmMapView } from "./CvmMapView";

export interface CvmMapProps {
  onRegister?: (position: GeoCoordinates) => void;
  onReposition?: (
    id: string,
    position: GeoCoordinates,
    editorPosition: GeoCoordinates,
  ) => void;
  onReport?: (
    id: string,
    position: GeoCoordinates,
    type: "missing" | "spam" | "inactive" | "inaccessible",
  ) => void;
  onUpvote?: (id: string, position: GeoCoordinates) => void;
  onDownvote?: (id: string, position: GeoCoordinates) => void;
  sharedCvmId: string | null;
}

export function CvmMap(props: CvmMapProps) {
  return (
    <CvmMapViewProvider>
      <CvmMapView {...props} />
    </CvmMapViewProvider>
  );
}
