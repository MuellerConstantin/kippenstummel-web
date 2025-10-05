"use client";

import Map, {
  AttributionControl,
  MapRef,
  NavigationControl,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import useMapCvmViewportData from "@/hooks/useMapCvmViewportData";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store";
import { GeoCoordinates } from "@/lib/types/geo";
import usabilitySlice from "@/store/slices/usability";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { HelpDialog } from "../navigation/HelpDialog";
import { FilterDialog } from "../navigation/FilterDialog";
import { CvmReportDialog } from "../cvm/CvmReportDialog";
import { MenuBottomNavigation } from "../navigation/MenuBottomNavigation";
import { CvmInfoDialog } from "../cvm/CvmInfoDialog";
import { useElementWidth } from "@/hooks/useElementWidth";
import { Cvm, CvmCluster } from "@/lib/types/cvm";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { SelectedMarker } from "@/components/molecules/map/SelectedMarker";
import { useLocale, useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useMapCvmSelection } from "@/hooks/useMapCvmSelection";
import { ConfirmRegisterBottomNavigation } from "../navigation/ConfirmRegisterBottomNavigation";
import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { MapLibreEvent } from "maplibre-gl";
import { LocateControl } from "./LocateControl";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";

import "maplibre-gl/dist/maplibre-gl.css";

interface CvmMapDefaultViewProps {
  markers: Cvm[];
  clusters: CvmCluster[];
  selectedCvm: Cvm | null;
  onSelectCvm?: (cvmId: string | null) => void;
  onUpvote?: (id: string, voterPosition: GeoCoordinates) => void;
  onDownvote?: (id: string, voterPosition: GeoCoordinates) => void;
  onReposition?: (id: string, editorPosition: GeoCoordinates) => void;
  onReport?: (
    id: string,
    reporterPosition: GeoCoordinates,
    type: "missing" | "spam" | "inactive" | "inaccessible",
  ) => void;
  onRegister?: (position: GeoCoordinates) => void;
}

/**
 * The default map view.
 *
 * @param props The props passed to the component.
 * @returns The default map view component.
 */
export function CvmMapDefaultView(props: CvmMapDefaultViewProps) {
  const {
    markers,
    clusters,
    selectedCvm,
    onSelectCvm,
    onDownvote,
    onUpvote,
    onReposition,
    onReport,
    onRegister,
  } = props;

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reporterPosition, setReporterPosition] = useState<GeoCoordinates>();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarWidth = useElementWidth(sidebarRef);

  const onHelp = useCallback(() => {
    setShowHelpDialog(true);
  }, [setShowHelpDialog]);

  const onFilter = useCallback(() => {
    setShowFilterDialog(true);
  }, [setShowFilterDialog]);

  return (
    <>
      <div className="pointer-events-none absolute flex h-full w-full">
        <div
          ref={sidebarRef}
          className="pointer-events-auto z-[2000] h-full shrink-0 pt-3 pb-3 pl-3"
        >
          <CvmInfoDialog
            open={!!selectedCvm}
            onOpenChange={(open) =>
              onSelectCvm?.(open ? selectedCvm!.id : null)
            }
            cvm={selectedCvm!}
            onUpvote={(voterPosition) =>
              onUpvote?.(selectedCvm!.id, voterPosition)
            }
            onDownvote={(voterPosition) =>
              onDownvote?.(selectedCvm!.id, voterPosition)
            }
            onReposition={(editorPosition) =>
              onReposition?.(selectedCvm!.id, editorPosition)
            }
            onReport={(reporterPosition) => {
              setShowReportDialog(true);
              setReporterPosition(reporterPosition);
            }}
          />
        </div>
        <div className="relative grow">
          <motion.div
            className="menu-bottom-navigation-wrapper pointer-events-auto fixed bottom-9 left-1/2 z-[2000] hidden h-fit w-fit -translate-x-1/2 px-2 lg:block"
            animate={{ x: !!selectedCvm ? sidebarWidth / 2 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <MenuBottomNavigation
              onHelp={onHelp}
              onFilter={onFilter}
              onRegister={onRegister}
            />
          </motion.div>
          <div className="menu-bottom-navigation-wrapper pointer-events-auto fixed bottom-9 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2 lg:hidden">
            <MenuBottomNavigation
              onHelp={onHelp}
              onFilter={onFilter}
              onRegister={onRegister}
            />
          </div>
        </div>
      </div>
      <AnimatedDialogModal
        isOpen={showReportDialog}
        onOpenChange={setShowReportDialog}
      >
        <CvmReportDialog
          onReport={(type) => {
            onReport?.(selectedCvm!.id, reporterPosition!, type);
            setShowReportDialog(false);
          }}
        />
      </AnimatedDialogModal>
      <AnimatedDialogModal
        className="!max-w-2xl"
        isOpen={showHelpDialog}
        onOpenChange={setShowHelpDialog}
      >
        <HelpDialog />
      </AnimatedDialogModal>
      <AnimatedDialogModal
        isOpen={showFilterDialog}
        onOpenChange={setShowFilterDialog}
      >
        <FilterDialog />
      </AnimatedDialogModal>
      {markers
        ?.filter((marker) => marker.id !== selectedCvm?.id)
        .map((marker) => (
          <LocationMarker
            key={marker.id}
            cvm={marker}
            onSelect={() => onSelectCvm?.(marker.id)}
          />
        ))}
      {clusters?.map((marker, index) => (
        <ClusterMarker
          key={index}
          position={{ latitude: marker.latitude, longitude: marker.longitude }}
          count={marker.count}
        />
      ))}
      {!!selectedCvm && <SelectedMarker cvm={selectedCvm} />}
    </>
  );
}

interface CvmMapAdjustableMarkerViewProps {
  originalPosition?: GeoCoordinates;
  maxDistance?: number;
  currentPosition: GeoCoordinates;
  onCurrentPositionChange: (position: GeoCoordinates) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A view that allows the user to adjust the position of a marker. Most
 * of the default view's controls are hidden.
 *
 * @param props The props passed to the component.
 * @returns The view component.
 */
function CvmMapAdjustableMarkerView(props: CvmMapAdjustableMarkerViewProps) {
  return (
    <>
      <AdjustableLocationMarker
        reference={
          props.originalPosition && props.maxDistance
            ? {
                position: props.originalPosition,
                maxDistance: props.maxDistance,
              }
            : undefined
        }
        position={props.currentPosition}
        onAdapt={props.onCurrentPositionChange}
      />
      <ConfirmRegisterBottomNavigation
        onCancel={props.onCancel}
        onConfirm={props.onConfirm}
      />
    </>
  );
}

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
  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { enqueue } = useNotifications();

  const mapRef = useRef<MapRef>(null);

  const location = useAppSelector((state) => state.location.location);
  const locatedAt = useAppSelector((state) => state.location.locatedAt);
  const mapView = useAppSelector((state) => state.usability.mapView);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registeringOrigPosition, setRegisteringOrigPosition] =
    useState<GeoCoordinates>();
  const [registeringCurrentPosition, setRegisteringCurrentPosition] =
    useState<GeoCoordinates>();

  const [isRepositioning, setIsRepositioning] = useState(false);
  const [repositioningEditorPosition, setRepositioningEditorPosition] =
    useState<GeoCoordinates>();
  const [repositioningOrigPosition, setRepositioningOrigPosition] =
    useState<GeoCoordinates>();
  const [repositioningCurrentPosition, setRepositioningCurrentPosition] =
    useState<GeoCoordinates>();

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

  const onRegister = useCallback((position: GeoCoordinates) => {
    setIsRegistering(true);
    setRegisteringCurrentPosition(position);
    setRegisteringOrigPosition(position);
    mapRef.current?.flyTo({
      center: [position.longitude, position.latitude],
      zoom: 18,
    });
  }, []);

  const onReposition = useCallback(
    (id: string, position: GeoCoordinates, editorPosition: GeoCoordinates) => {
      setIsRepositioning(true);
      setRepositioningEditorPosition(editorPosition);
      setRepositioningCurrentPosition(position);
      setRepositioningOrigPosition(position);
      mapRef.current?.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 18,
      });
    },
    [],
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
      <AttributionControl compact />
      <NavigationControl />
      <LocateControl />
      {location && (
        <LocateMarker
          position={location}
          lastUpdatedAgo={new Date().getTime() - new Date(locatedAt!).getTime()}
        />
      )}
      {!isRegistering && !isRepositioning && (
        <CvmMapDefaultView
          markers={markers || []}
          clusters={clusters || []}
          selectedCvm={selectedCvm}
          onRegister={onRegister}
          onReposition={(id, editorPosition) => {
            onReposition(
              id,
              {
                latitude: selectedCvm!.latitude,
                longitude: selectedCvm!.longitude,
              },
              editorPosition,
            );
          }}
          onDownvote={props.onDownvote}
          onUpvote={props.onUpvote}
          onReport={props.onReport}
          onSelectCvm={selectCvmId}
        />
      )}
      {isRegistering && (
        <CvmMapAdjustableMarkerView
          onCancel={() => setIsRegistering(false)}
          onConfirm={() => {
            props.onRegister?.(registeringCurrentPosition!);
            setIsRegistering(false);
          }}
          originalPosition={registeringOrigPosition}
          maxDistance={25}
          onCurrentPositionChange={setRegisteringCurrentPosition}
          currentPosition={registeringCurrentPosition!}
        />
      )}
      {isRepositioning && (
        <CvmMapAdjustableMarkerView
          onCancel={() => setIsRepositioning(false)}
          onConfirm={() => {
            props.onReposition?.(
              selectedCvm!.id,
              repositioningCurrentPosition!,
              repositioningEditorPosition!,
            );
            setIsRepositioning(false);
          }}
          originalPosition={repositioningOrigPosition}
          maxDistance={25}
          onCurrentPositionChange={setRepositioningCurrentPosition}
          currentPosition={repositioningCurrentPosition!}
        />
      )}
    </Map>
  );
}
