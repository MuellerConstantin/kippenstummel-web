"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Leaflet from "leaflet";
import { AttributionControl, ZoomControl } from "react-leaflet";
import { LeafletMap } from "@/components/organisms/leaflet/LeafletMap";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";
import { LocateControlPlugin } from "./LocateControl";
import { HelpDialog } from "../navigation/HelpDialog";
import { useAppDispatch, useAppSelector } from "@/store";
import usabilitySlice from "@/store/slices/usability";
import { MenuBottomNavigation } from "../navigation/MenuBottomNavigation";
import { FilterDialog } from "../navigation/FilterDialog";
import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { ConfirmRegisterBottomNavigation } from "../navigation/ConfirmRegisterBottomNavigation";
import { CvmInfoDialog } from "../cvm/CvmInfoDialog";
import { CvmReportDialog } from "../cvm/CvmReportDialog";
import { SelectedMarker } from "@/components/molecules/map/SelectedMarker";
import { motion } from "framer-motion";
import { MapLibreTileLayer } from "../leaflet/MapLibreTileLayer";
import useMapCvmViewportData from "@/hooks/useMapCvmViewportData";
import { CvmCluster, Cvm } from "@/lib/types/cvm";
import { useMapCvmSelection } from "@/hooks/useMapCvmSelection";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useTranslations } from "next-intl";
import { useElementWidth } from "@/hooks/useElementWidth";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { GeoCoordinates } from "@/lib/types/geo";

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
      <div className="absolute flex h-full w-full">
        <div
          ref={sidebarRef}
          className="z-[2000] h-full shrink-0 pt-3 pb-6 pl-3"
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
            className="fixed bottom-12 left-1/2 z-[2000] hidden h-fit w-fit -translate-x-1/2 px-2 md:block"
            animate={{ x: !!selectedCvm ? sidebarWidth / 2 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <MenuBottomNavigation
              onHelp={onHelp}
              onFilter={onFilter}
              onRegister={onRegister}
            />
          </motion.div>
          <div className="absolute bottom-6 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2 md:hidden">
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
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { enqueue } = useNotifications();

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

  const [map, setMap] = useState<Leaflet.Map | null>(null);
  const [zoom, setZoom] = useState<number>();
  const [bottomLeft, setBottomLeft] = useState<GeoCoordinates>();
  const [topRight, setTopRight] = useState<GeoCoordinates>();

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

  /*
   * Center the map once to an optional shared CVM immediately
   * after the component mounts.
   */
  useEffect(() => {
    if (!!selectedCvm && isSharedSelection) {
      map?.setView([selectedCvm.latitude, selectedCvm.longitude], 18);
    }
  }, [selectedCvm, isSharedSelection, map]);

  const onReady = useCallback((map: Leaflet.Map) => {
    const mapBounds = map.getBounds();

    setBottomLeft({
      latitude: mapBounds.getSouthWest().lat,
      longitude: mapBounds.getSouthWest().lng,
    });
    setTopRight({
      latitude: mapBounds.getNorthEast().lat,
      longitude: mapBounds.getNorthEast().lng,
    });
    setZoom(map.getZoom());

    setMap(map);
  }, []);

  const onViewportChange = useCallback(
    (event: Leaflet.LeafletEvent) => {
      const map = event.target as Leaflet.Map;
      const mapBounds = map.getBounds();

      setBottomLeft({
        latitude: mapBounds.getSouthWest().lat,
        longitude: mapBounds.getSouthWest().lng,
      });
      setTopRight({
        latitude: mapBounds.getNorthEast().lat,
        longitude: mapBounds.getNorthEast().lng,
      });
      setZoom(map.getZoom());

      dispatch(
        usabilitySlice.actions.setMapView({
          center: {
            latitude: mapBounds.getCenter().lat,
            longitude: mapBounds.getCenter().lng,
          },
          zoom: map.getZoom(),
        }),
      );
    },
    [dispatch],
  );

  const onRegister = useCallback(
    (position: GeoCoordinates) => {
      setIsRegistering(true);
      setRegisteringCurrentPosition(position);
      setRegisteringOrigPosition(position);
      map?.flyTo(Leaflet.latLng(position.latitude, position.longitude), 19);
    },
    [map],
  );

  const onReposition = useCallback(
    (id: string, position: GeoCoordinates, editorPosition: GeoCoordinates) => {
      setIsRepositioning(true);
      setRepositioningEditorPosition(editorPosition);
      setRepositioningCurrentPosition(position);
      setRepositioningOrigPosition(position);
      map?.flyTo(Leaflet.latLng(position.latitude, position.longitude), 19);
    },
    [map],
  );

  if (!mapView) {
    return null;
  }

  return (
    <LeafletMap
      center={[mapView.center.latitude, mapView.center.longitude]}
      zoom={mapView.zoom}
      minZoom={8}
      maxZoom={19}
      onReady={onReady}
      onMoveEnd={onViewportChange}
      onZoomEnd={onViewportChange}
    >
      <MapLibreTileLayer url="/tiles/default.json" />
      <AttributionControl prefix={false} />
      <ZoomControl position="topright" zoomInTitle="" zoomOutTitle="" />
      <LocateControlPlugin position="topright" />
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
    </LeafletMap>
  );
}
