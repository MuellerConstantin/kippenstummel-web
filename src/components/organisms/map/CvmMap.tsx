"use client";

import Map, {
  AttributionControl,
  MapRef,
  NavigationControl,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import useMapCvmViewportData from "@/hooks/useMapCvmViewportData";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { GeoCoordinates } from "@/lib/types/geo";
import usabilitySlice from "@/store/slices/usability";
import { CvmMapDefaultOverlay } from "./CvmMapDefaultOverlay";
import { useLocale, useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useMapCvmSelection } from "@/hooks/useMapCvmSelection";
import { MapLibreEvent } from "maplibre-gl";
import { LocateControl } from "./LocateControl";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";

import "maplibre-gl/dist/maplibre-gl.css";
import { CvmMapRegisterOverlay } from "./CvmMapRegisterOverlay";
import { CvmMapRepositionOverlay } from "./CvmMapRepositionOverlay";

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
  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { enqueue } = useNotifications();

  const mapRef = useRef<MapRef>(null);
  const [mode, setMode] = useState<MapMode>("default");

  const location = useAppSelector((state) => state.location.location);
  const locatedAt = useAppSelector((state) => state.location.locatedAt);
  const mapView = useAppSelector((state) => state.usability.mapView);
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

  const mapStylePath = useMemo(() => {
    switch (locale) {
      case "de":
        return "/tiles/default-de.json";
      default:
        return "/tiles/default-en.json";
    }
  }, [locale]);

  const mapLocale = useMemo(
    () => ({
      "AttributionControl.ToggleAttribution": t(
        "MapLibreControls.AttributionControl.ToggleAttribution",
      ),
      "AttributionControl.MapFeedback": t(
        "MapLibreControls.AttributionControl.MapFeedback",
      ),
      "FullscreenControl.Enter": t("MapLibreControls.FullscreenControl.Enter"),
      "FullscreenControl.Exit": t("MapLibreControls.FullscreenControl.Exit"),
      "GeolocateControl.FindMyLocation": t(
        "MapLibreControls.GeolocateControl.FindMyLocation",
      ),
      "GeolocateControl.LocationNotAvailable": t(
        "MapLibreControls.GeolocateControl.LocationNotAvailable",
      ),
      "LogoControl.Title": t("MapLibreControls.LogoControl.Title"),
      "Map.Title": t("MapLibreControls.Map.Title"),
      "Marker.Title": t("MapLibreControls.Marker.Title"),
      "NavigationControl.ResetBearing": t(
        "MapLibreControls.NavigationControl.ResetBearing",
      ),
      "NavigationControl.ZoomIn": t(
        "MapLibreControls.NavigationControl.ZoomIn",
      ),
      "NavigationControl.ZoomOut": t(
        "MapLibreControls.NavigationControl.ZoomOut",
      ),
      "Popup.Close": t("MapLibreControls.Popup.Close"),
      "ScaleControl.Feet": t("MapLibreControls.ScaleControl.Feet"),
      "ScaleControl.Meters": t("MapLibreControls.ScaleControl.Meters"),
      "ScaleControl.Kilometers": t("MapLibreControls.ScaleControl.Kilometers"),
      "ScaleControl.Miles": t("MapLibreControls.ScaleControl.Miles"),
      "ScaleControl.NauticalMiles": t(
        "MapLibreControls.ScaleControl.NauticalMiles",
      ),
      "GlobeControl.Enable": t("MapLibreControls.GlobeControl.Enable"),
      "GlobeControl.Disable": t("MapLibreControls.GlobeControl.Disable"),
      "TerrainControl.Enable": t("MapLibreControls.TerrainControl.Enable"),
      "TerrainControl.Disable": t("MapLibreControls.TerrainControl.Disable"),
      "CooperativeGesturesHandler.WindowsHelpText": t(
        "MapLibreControls.CooperativeGesturesHandler.WindowsHelpText",
      ),
      "CooperativeGesturesHandler.MacHelpText": t(
        "MapLibreControls.CooperativeGesturesHandler.MacHelpText",
      ),
      "CooperativeGesturesHandler.MobileHelpText": t(
        "MapLibreControls.CooperativeGesturesHandler.MobileHelpText",
      ),
    }),
    [t],
  );

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

  const onLoad = useCallback((event: MapLibreEvent) => {
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

  const onViewStateChanged = useCallback(
    (event: ViewStateChangeEvent) => {
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

      dispatch(
        usabilitySlice.actions.setMapView({
          center: {
            latitude: mapBounds.getCenter().lat,
            longitude: mapBounds.getCenter().lng,
          },
          zoom: mapZoom,
        }),
      );
    },
    [dispatch],
  );

  const onRegisterStart = useCallback((position: GeoCoordinates) => {
    setMode("register");
    setEditorPosition(position);

    mapRef.current?.flyTo({
      center: [position.longitude, position.latitude],
      zoom: 18,
    });
  }, []);

  const onRepositionStart = useCallback(
    (editorPosition: GeoCoordinates) => {
      setMode("reposition");
      setEditorPosition(editorPosition);

      mapRef.current?.flyTo({
        center: [selectedCvm!.longitude, selectedCvm!.latitude],
        zoom: 18,
      });
    },
    [selectedCvm],
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

  if (!mapView) {
    return null;
  }

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: mapView.center.longitude,
        latitude: mapView.center.latitude,
        zoom: mapView.zoom,
      }}
      style={{ flexGrow: 1 }}
      mapStyle={mapStylePath}
      minZoom={8}
      maxZoom={19}
      attributionControl={false}
      onLoad={onLoad}
      onZoomEnd={onViewStateChanged}
      onMoveEnd={onViewStateChanged}
      locale={mapLocale}
    >
      <AttributionControl compact={false} />
      <NavigationControl />
      <LocateControl />
      {location && (
        <LocateMarker
          position={location}
          lastUpdatedAgo={new Date().getTime() - new Date(locatedAt!).getTime()}
        />
      )}
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
    </Map>
  );
}
