"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Leaflet from "leaflet";
import { AttributionControl, useMap, ZoomControl } from "react-leaflet";
import { LeafletMap } from "@/components/organisms/leaflet/LeafletMap";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";
import { LocateControlPlugin } from "./LocateControl";
import { HelpDialog } from "./HelpDialog";
import { useAppDispatch, useAppSelector } from "@/store";
import usabilitySlice from "@/store/slices/usability";
import { MenuBottomNavigation } from "./MenuBottomNavigation";
import { FilterDialog } from "./FilterDialog";
import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { ConfirmRegisterBottomNavigation } from "./ConfirmRegisterBottomNavigation";
import { CvmInfoDialog } from "./CvmInfoDialog";
import { CvmReportDialog } from "./CvmReportDialog";
import { SelectedMarker } from "@/components/molecules/map/SelectedMarker";
import { motion } from "framer-motion";
import { MapLibreTileLayer } from "../leaflet/MapLibreTileLayer";
import useMapCvmViewportData from "@/hooks/useMapCvmViewportData";
import { CvmClusterDto, CvmDto } from "@/lib/types/cvm";
import { useMapCvmSelection } from "@/hooks/useMapCvmSelection";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useTranslations } from "next-intl";
import { useElementWidth } from "@/hooks/useElementWidth";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";

interface CvmMapDefaultViewProps {
  markers: CvmDto[];
  clusters: CvmClusterDto[];
  selectedCvm: CvmDto | null;
  onSelectCvm?: (cvmId: string | null) => void;
  onUpvote?: (id: string, voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (id: string, voterPosition: Leaflet.LatLng) => void;
  onReposition?: (id: string, editorPosition: Leaflet.LatLng) => void;
  onReport?: (
    id: string,
    reporterPosition: Leaflet.LatLng,
    type: "missing" | "spam" | "inactive" | "inaccessible",
  ) => void;
  onRegister?: (position: Leaflet.LatLng) => void;
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

  const map = useMap();

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reporterPosition, setReporterPosition] = useState<Leaflet.LatLng>();

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
              map={map!}
              onHelp={onHelp}
              onFilter={onFilter}
              onRegister={onRegister}
            />
          </motion.div>
          <div className="absolute bottom-6 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2 md:hidden">
            <MenuBottomNavigation
              map={map!}
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
          position={new Leaflet.LatLng(marker.latitude, marker.longitude)}
          count={marker.count}
        />
      ))}
      {!!selectedCvm && <SelectedMarker cvm={selectedCvm} />}
    </>
  );
}

interface CvmMapAdjustableMarkerViewProps {
  originalPosition?: Leaflet.LatLng;
  maxDistance?: number;
  currentPosition: Leaflet.LatLng;
  onCurrentPositionChange: (position: Leaflet.LatLng) => void;
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
  onRegister?: (position: Leaflet.LatLng) => void;
  onReposition?: (
    id: string,
    position: Leaflet.LatLng,
    editorPosition: Leaflet.LatLng,
  ) => void;
  onReport?: (
    id: string,
    position: Leaflet.LatLng,
    type: "missing" | "spam" | "inactive" | "inaccessible",
  ) => void;
  onUpvote?: (id: string, position: Leaflet.LatLng) => void;
  onDownvote?: (id: string, position: Leaflet.LatLng) => void;
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
  const [registerPosition, setRegisterPosition] = useState<Leaflet.LatLng>();

  const [isRepositioning, setIsRepositioning] = useState(false);
  const [repositioningEditorPosition, setRepositioningEditorPosition] =
    useState<Leaflet.LatLng>();
  const [repositioningPosition, setRepositioningPosition] =
    useState<Leaflet.LatLng>();

  const [map, setMap] = useState<Leaflet.Map | null>(null);
  const [zoom, setZoom] = useState<number>();
  const [bottomLeft, setBottomLeft] = useState<[number, number]>();
  const [topRight, setTopRight] = useState<[number, number]>();

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

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
    setZoom(map.getZoom());

    setMap(map);
  }, []);

  const onViewportChange = useCallback(
    (event: Leaflet.LeafletEvent) => {
      const map = event.target as Leaflet.Map;
      const mapBounds = map.getBounds();

      setBottomLeft([
        mapBounds.getSouthWest().lat,
        mapBounds.getSouthWest().lng,
      ]);
      setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
      setZoom(map.getZoom());

      dispatch(
        usabilitySlice.actions.setMapView({
          center: [mapBounds.getCenter().lat, mapBounds.getCenter().lng],
          zoom: map.getZoom(),
        }),
      );
    },
    [dispatch],
  );

  const onRegister = useCallback(
    (position: Leaflet.LatLng) => {
      setIsRegistering(true);
      setRegisterPosition(position);
      map?.setView(position, 19);
    },
    [map],
  );

  const onReposition = useCallback(
    (id: string, position: Leaflet.LatLng, editorPosition: Leaflet.LatLng) => {
      setIsRepositioning(true);
      setRepositioningEditorPosition(editorPosition);
      setRepositioningPosition(position);
      map?.setView(position, 19);
    },
    [map],
  );

  if (!mapView) {
    return null;
  }

  return (
    <LeafletMap
      center={mapView.center}
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
          position={new Leaflet.LatLng(location.lat, location.lng)}
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
              new Leaflet.LatLng(selectedCvm!.latitude, selectedCvm!.longitude),
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
            props.onRegister?.(registerPosition!);
            setIsRegistering(false);
          }}
          originalPosition={new Leaflet.LatLng(location!.lat, location!.lng)}
          maxDistance={25}
          onCurrentPositionChange={setRegisterPosition}
          currentPosition={registerPosition!}
        />
      )}
      {isRepositioning && (
        <CvmMapAdjustableMarkerView
          onCancel={() => setIsRepositioning(false)}
          onConfirm={() => {
            props.onReposition?.(
              selectedCvm!.id,
              repositioningPosition!,
              repositioningEditorPosition!,
            );
            setIsRepositioning(false);
          }}
          originalPosition={
            new Leaflet.LatLng(
              repositioningPosition!.lat,
              repositioningPosition!.lng,
            )
          }
          maxDistance={25}
          onCurrentPositionChange={setRepositioningPosition}
          currentPosition={repositioningPosition!}
        />
      )}
    </LeafletMap>
  );
}
