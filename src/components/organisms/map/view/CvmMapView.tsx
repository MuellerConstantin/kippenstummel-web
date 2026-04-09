"use client";

import { useCvmMapViewportData } from "@/hooks/cvm/useCvmMapViewportData";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { GeoCoordinates } from "@/lib/types/geo";
import { CvmMapDefaultOverlay } from "./CvmMapDefaultOverlay";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useCvmMapSelection } from "@/hooks/cvm/useCvmMapSelection";
import { CvmMapRegisterOverlay } from "./CvmMapRegisterOverlay";
import { CvmMapRepositionOverlay } from "./CvmMapRepositionOverlay";
import { CvmMapTemplate } from "@/components/templates/map/CvmMapTemplate";
import { useCvmMapView } from "@/contexts/CvmMapViewProvider";
import { useCvmMapViewport } from "@/hooks/cvm/useMapCvmViewport";
import { useAppSelector } from "@/store";
import { useCvmMapFollow } from "@/contexts/CvmMapFollowProvider";

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

  const autoFollowRef = useRef(false);
  const autoLocation = useAppSelector((state) => state.usability.autoLocation);
  const location = useAppSelector((state) => state.location.location);
  const { pauseFollowing, isFollowing, isWatching, startTrackingAndFollow } =
    useCvmMapFollow();

  const { state, goToDefaultMode, goToRegisterMode, goToRepositionMode } =
    useCvmMapView();
  const { zoom, bottomLeft, topRight, map, onLoad, onViewStateChanged } =
    useCvmMapViewport();

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

  useEffect(() => {
    if (!map) return;

    const handleUserInteraction = (event: { originalEvent?: unknown }) => {
      if (!event.originalEvent) return;
      pauseFollowing();
    };

    map.on("movestart", handleUserInteraction);
    map.on("zoomstart", handleUserInteraction);
    map.on("rotatestart", handleUserInteraction);
    map.on("pitchstart", handleUserInteraction);

    return () => {
      map.off("movestart", handleUserInteraction);
      map.off("zoomstart", handleUserInteraction);
      map.off("rotatestart", handleUserInteraction);
      map.off("pitchstart", handleUserInteraction);
    };
  }, [map, pauseFollowing]);

  const onRegisterStart = useCallback(
    (position: GeoCoordinates) => {
      pauseFollowing();

      goToRegisterMode(position);

      map?.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 18,
      });
    },
    [map, goToRegisterMode, pauseFollowing],
  );

  const onRepositionStart = useCallback(
    (editorPosition: GeoCoordinates) => {
      pauseFollowing();

      goToRepositionMode(selectedCvmPosition!, editorPosition);

      map?.flyTo({
        center: [selectedCvm!.longitude, selectedCvm!.latitude],
        zoom: 18,
      });
    },
    [selectedCvm, map, goToRepositionMode, selectedCvmPosition, pauseFollowing],
  );

  const onRegisterEnd = useCallback(
    (newPosition: GeoCoordinates) => {
      onRegister?.(newPosition!);
      goToDefaultMode();
    },
    [onRegister, goToDefaultMode],
  );

  const onRepositionEnd = useCallback(
    (newPosition: GeoCoordinates, editorPosition: GeoCoordinates) => {
      onReposition?.(selectedCvm!.id, newPosition, editorPosition!);
      goToDefaultMode();
    },
    [selectedCvm, onReposition, goToDefaultMode],
  );

  useEffect(() => {
    if (autoFollowRef.current) return;
    if (!autoLocation) return;

    autoFollowRef.current = true;
    startTrackingAndFollow();
  }, [autoLocation, startTrackingAndFollow]);

  useEffect(() => {
    if (!map) return;
    if (!location) return;
    if (!isWatching) return;
    if (!isFollowing) return;

    map.easeTo({
      center: [location.longitude, location.latitude],
    });
  }, [map, location, isWatching, isFollowing]);

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
          onRegister={onRegisterEnd}
          onCancel={() => goToDefaultMode()}
        />
      )}
      {state.mode === "reposition" && (
        <CvmMapRepositionOverlay
          onReposition={onRepositionEnd}
          onCancel={() => goToDefaultMode()}
        />
      )}
    </CvmMapTemplate>
  );
}
