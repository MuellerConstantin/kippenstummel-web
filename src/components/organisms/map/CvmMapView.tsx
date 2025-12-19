"use client";

import { useCvmMapViewportData } from "@/hooks/cvm/useCvmMapViewportData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GeoCoordinates } from "@/lib/types/geo";
import { CvmMapDefaultOverlay } from "./CvmMapDefaultOverlay";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useCvmMapSelection } from "@/hooks/cvm/useCvmMapSelection";
import { CvmMapRegisterOverlay } from "./CvmMapRegisterOverlay";
import { CvmMapRepositionOverlay } from "./CvmMapRepositionOverlay";
import { CvmMapTemplate } from "@/components/templates/cvm/CvmMapTemplate";
import { useCvmMapView } from "@/contexts/CvmMapViewContext";
import { useCvmMapViewport } from "@/hooks/cvm/useMapCvmViewport";

export interface CvmMapViewProps {
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

export function CvmMapView({
  onRegister,
  onReposition,
  ...props
}: CvmMapViewProps) {
  const t = useTranslations();
  const { enqueue } = useNotifications();

  const { state, goToDefaultMode, goToRegisterMode, goToRepositionMode } =
    useCvmMapView();
  const { zoom, bottomLeft, topRight, map, onLoad, onViewStateChanged } =
    useCvmMapViewport();
  const [editorPosition, setEditorPosition] = useState<GeoCoordinates>();

  const { markers, clusters } = useCvmMapViewportData({
    zoom: zoom!,
    bottomLeft: bottomLeft!,
    topRight: topRight!,
  });

  const {
    selectedCvm,
    selectCvmId,
    error: selectedCvmError,
    isSharedSelection,
  } = useCvmMapSelection({
    sharedCvmId: props.sharedCvmId,
  });

  const selectedCvmPosition = useMemo(() => {
    if (!selectedCvm) {
      return null;
    }

    return {
      latitude: selectedCvm.latitude,
      longitude: selectedCvm.longitude,
    };
  }, [selectedCvm]);

  /**
   * Show a notification when the selected CVM is not found. This
   * happens mostly when the shared CVM is not found.
   */
  useEffect(() => {
    if (selectedCvmError) {
      enqueue(
        {
          title: isSharedSelection
            ? t("Notifications.sharedNotFound.title")
            : t("Notifications.selectedNotFound.title"),
          description: isSharedSelection
            ? t("Notifications.sharedNotFound.description")
            : t("Notifications.selectedNotFound.description"),
          variant: "error",
        },
        { timeout: 10000 },
      );
    }
  }, [selectedCvmError, isSharedSelection, enqueue, t]);

  useEffect(() => {
    if (isSharedSelection && selectedCvmPosition) {
      map?.flyTo({
        center: [selectedCvmPosition.longitude, selectedCvmPosition.latitude],
        zoom: 18,
      });
    }
  }, [isSharedSelection, selectedCvmPosition, map]);

  const onRegisterStart = useCallback(
    (position: GeoCoordinates) => {
      goToRegisterMode();
      setEditorPosition(position);

      map?.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 18,
      });
    },
    [map, goToRegisterMode],
  );

  const onRepositionStart = useCallback(
    (editorPosition: GeoCoordinates) => {
      goToRepositionMode();
      setEditorPosition(editorPosition);

      map?.flyTo({
        center: [selectedCvm!.longitude, selectedCvm!.latitude],
        zoom: 18,
      });
    },
    [selectedCvm, map, goToRepositionMode],
  );

  const onRegisterEnd = useCallback(
    (newPosition: GeoCoordinates) => {
      onRegister?.(newPosition!);
      goToDefaultMode();
    },
    [onRegister, goToDefaultMode],
  );

  const onRepositionEnd = useCallback(
    (newPosition: GeoCoordinates) => {
      onReposition?.(selectedCvm!.id, newPosition!, editorPosition!);
      goToDefaultMode();
    },
    [selectedCvm, onReposition, editorPosition, goToDefaultMode],
  );

  return (
    <CvmMapTemplate onLoad={onLoad} onViewChange={onViewStateChanged}>
      {state.mode === "default" && (
        <CvmMapDefaultOverlay
          onSelect={(cvmId) => selectCvmId(cvmId)}
          onDeselect={() => selectCvmId(null)}
          selectedCvm={selectedCvm!}
          markers={markers || []}
          clusters={clusters || []}
          onUpvote={(voterPosition) =>
            props.onUpvote?.(selectedCvm!.id, voterPosition)
          }
          onDownvote={(voterPosition) =>
            props.onDownvote?.(selectedCvm!.id, voterPosition)
          }
          onReport={(reporterPosition, type) => {
            props.onReport?.(selectedCvm!.id, reporterPosition!, type);
          }}
          onReposition={onRepositionStart}
          onRegister={onRegisterStart}
        />
      )}
      {state.mode === "register" && (
        <CvmMapRegisterOverlay
          originalPosition={editorPosition!}
          onRegister={onRegisterEnd}
          onCancel={() => goToDefaultMode()}
        />
      )}
      {state.mode === "reposition" && (
        <CvmMapRepositionOverlay
          originalPosition={selectedCvmPosition!}
          onReposition={onRepositionEnd}
          onCancel={() => goToDefaultMode()}
        />
      )}
    </CvmMapTemplate>
  );
}
