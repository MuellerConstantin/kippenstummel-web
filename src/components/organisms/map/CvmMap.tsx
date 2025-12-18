"use client";

import { ViewStateChangeEvent } from "react-map-gl/maplibre";
import useMapCvmViewportData from "@/hooks/cvm/useMapCvmViewportData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GeoCoordinates } from "@/lib/types/geo";
import { CvmMapDefaultOverlay } from "./CvmMapDefaultOverlay";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useMapCvmSelection } from "@/hooks/cvm/useMapCvmSelection";
import { Map, MapLibreEvent } from "maplibre-gl";
import { CvmMapRegisterOverlay } from "./CvmMapRegisterOverlay";
import { CvmMapRepositionOverlay } from "./CvmMapRepositionOverlay";
import { CvmMapTemplate } from "@/components/templates/cvm/CvmMapTemplate";

type MapMode = "default" | "register" | "reposition";

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

export function CvmMap({ onRegister, onReposition, ...props }: CvmMapProps) {
  const t = useTranslations();
  const { enqueue } = useNotifications();

  const [map, setMap] = useState<Map | null>(null);
  const [mode, setMode] = useState<MapMode>("default");

  const [editorPosition, setEditorPosition] = useState<GeoCoordinates>();

  const [bottomLeft, setBottomLeft] = useState<GeoCoordinates>();
  const [topRight, setTopRight] = useState<GeoCoordinates>();
  const [zoom, setZoom] = useState<number>();

  const { markers, clusters } = useMapCvmViewportData({
    zoom: zoom!,
    bottomLeft: bottomLeft!,
    topRight: topRight!,
  });

  const {
    selectedCvm,
    selectCvmId,
    error: selectedCvmError,
    isSharedSelection,
  } = useMapCvmSelection({
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

  const onLoad = useCallback((event: MapLibreEvent) => {
    setMap(event.target);

    const mapBounds = event.target.getBounds();
    const mapZoom = Math.ceil(event.target.getZoom());

    setBottomLeft({
      latitude: mapBounds.getSouthWest().lat,
      longitude: mapBounds.getSouthWest().lng,
    });
    setTopRight({
      latitude: mapBounds.getNorthEast().lat,
      longitude: mapBounds.getNorthEast().lng,
    });
    setZoom(mapZoom);
  }, []);

  const onViewStateChanged = useCallback((event: ViewStateChangeEvent) => {
    const mapBounds = event.target.getBounds();
    const mapZoom = Math.ceil(event.target.getZoom());

    setBottomLeft({
      latitude: mapBounds.getSouthWest().lat,
      longitude: mapBounds.getSouthWest().lng,
    });
    setTopRight({
      latitude: mapBounds.getNorthEast().lat,
      longitude: mapBounds.getNorthEast().lng,
    });
    setZoom(mapZoom);
  }, []);

  const onRegisterStart = useCallback(
    (position: GeoCoordinates) => {
      setMode("register");
      setEditorPosition(position);

      map?.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 18,
      });
    },
    [map],
  );

  const onRepositionStart = useCallback(
    (editorPosition: GeoCoordinates) => {
      setMode("reposition");
      setEditorPosition(editorPosition);

      map?.flyTo({
        center: [selectedCvm!.longitude, selectedCvm!.latitude],
        zoom: 18,
      });
    },
    [selectedCvm, map],
  );

  const onRegisterEnd = useCallback(
    (newPosition: GeoCoordinates) => {
      onRegister?.(newPosition!);
      setMode("default");
    },
    [onRegister],
  );

  const onRepositionEnd = useCallback(
    (newPosition: GeoCoordinates) => {
      onReposition?.(selectedCvm!.id, newPosition!, editorPosition!);
      setMode("default");
    },
    [selectedCvm, onReposition, editorPosition],
  );

  return (
    <CvmMapTemplate onLoad={onLoad} onViewChange={onViewStateChanged}>
      {mode === "default" && (
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
      {mode === "register" && (
        <CvmMapRegisterOverlay
          originalPosition={editorPosition!}
          onRegister={onRegisterEnd}
          onCancel={() => setMode("default")}
        />
      )}
      {mode === "reposition" && (
        <CvmMapRepositionOverlay
          originalPosition={selectedCvmPosition!}
          onReposition={onRepositionEnd}
          onCancel={() => setMode("default")}
        />
      )}
    </CvmMapTemplate>
  );
}
