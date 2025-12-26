"use client";

import Map, {
  MapRef,
  NavigationControl,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { MapLibreEvent } from "maplibre-gl";
import { useRef, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { LocateControl } from "@/components/organisms/map/LocateControl";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";
import { LegalAndAttributionControl } from "./LegalAndAttributionControl";
import { useAppDispatch, useAppSelector } from "@/store";
import usabilitySlice from "@/store/slices/usability";

import "maplibre-gl/dist/maplibre-gl.css";

export interface BaseMapProps {
  onLoad?: (event: MapLibreEvent) => void;
  onViewChange?: (event: ViewStateChangeEvent) => void;
  children?: React.ReactNode;
}

export function BaseMap({ onLoad, onViewChange, children }: BaseMapProps) {
  const mapRef = useRef<MapRef>(null);
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const location = useAppSelector((state) => state.location.location);
  const locatedAt = useAppSelector((state) => state.location.locatedAt);
  const mapView = useAppSelector((state) => state.usability.mapView);

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

  const handleLoad = useCallback(
    (event: MapLibreEvent) => {
      if (mapRef.current) {
        onLoad?.(event);
      }
    },
    [onLoad],
  );

  const handleViewStateChanged = useCallback(
    (event: ViewStateChangeEvent) => {
      const mapBounds = event.target.getBounds();
      const mapZoom = Math.ceil(event.target.getZoom());

      dispatch(
        usabilitySlice.actions.setMapView({
          center: {
            latitude: mapBounds.getCenter().lat,
            longitude: mapBounds.getCenter().lng,
          },
          zoom: mapZoom,
        }),
      );

      onViewChange?.(event);
    },
    [dispatch, onViewChange],
  );

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: mapView.center.longitude,
        latitude: mapView.center.latitude,
        zoom: mapView.zoom,
      }}
      mapStyle={"/tiles/default.json"}
      style={{ width: "100%", height: "100%" }}
      minZoom={8}
      maxZoom={19}
      attributionControl={false}
      locale={mapLocale}
      onLoad={handleLoad}
      onMoveEnd={handleViewStateChanged}
      onZoomEnd={handleViewStateChanged}
    >
      <LegalAndAttributionControl position="bottom-right" />
      <NavigationControl />
      <LocateControl />
      {children}
      {location && (
        <LocateMarker
          position={location}
          lastUpdatedAgo={new Date().getTime() - new Date(locatedAt!).getTime()}
        />
      )}
    </Map>
  );
}
