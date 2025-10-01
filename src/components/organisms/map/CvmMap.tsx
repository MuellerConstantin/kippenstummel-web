"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Leaflet from "leaflet";
import { AttributionControl, useMap, ZoomControl } from "react-leaflet";
import { LeafletMap } from "@/components/organisms/leaflet/LeafletMap";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";
import { Modal } from "@/components/atoms/Modal";
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
import { AnimatePresence, motion } from "framer-motion";
import { MapLibreTileLayer } from "../leaflet/MapLibreTileLayer";
import useMapCvmViewportData from "@/hooks/useMapCvmViewportData";
import { CvmClusterDto, CvmDto } from "@/lib/types/cvm";
import { useMapCvmSelection } from "@/hooks/useMapCvmSelection";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useTranslations } from "next-intl";

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
  const [sidebarWidth, setSidebarWidth] = useState(0);

  useEffect(() => {
    if (!sidebarRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSidebarWidth(entry.contentRect.width);
      }
    });

    observer.observe(sidebarRef.current);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarRef.current]);

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
      <AnimatePresence>
        {showReportDialog && (
          <Modal
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            isOpen={showReportDialog}
            onOpenChange={setShowReportDialog}
          >
            <CvmReportDialog
              onReport={(type) => {
                onReport?.(selectedCvm!.id, reporterPosition!, type);
                setShowReportDialog(false);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showHelpDialog && (
          <Modal
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="!max-w-2xl"
            isOpen={showHelpDialog}
            onOpenChange={setShowHelpDialog}
          >
            <HelpDialog />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFilterDialog && (
          <Modal
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            isOpen={showFilterDialog}
            onOpenChange={setShowFilterDialog}
          >
            <FilterDialog />
          </Modal>
        )}
      </AnimatePresence>
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

interface CvmMapRegisteringViewProps {
  originalPosition?: Leaflet.LatLng;
  maxDistance?: number;
  currentPosition: Leaflet.LatLng;
  onCurrentPositionChange: (position: Leaflet.LatLng) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function CvmMapRegisteringView({
  onConfirm,
  onCancel,
  originalPosition,
  maxDistance,
  currentPosition,
  onCurrentPositionChange,
}: CvmMapRegisteringViewProps) {
  return (
    <>
      <AdjustableLocationMarker
        reference={
          (originalPosition &&
            maxDistance && {
              position: originalPosition,
              maxDistance,
            }) ||
          undefined
        }
        position={currentPosition}
        onAdapt={onCurrentPositionChange}
      />
      <ConfirmRegisterBottomNavigation
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </>
  );
}

interface CvmMapRepositioningViewProps {
  originalPosition?: Leaflet.LatLng;
  maxDistance?: number;
  currentPosition: Leaflet.LatLng;
  onCurrentPositionChange: (position: Leaflet.LatLng) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function CvmMapRepositioningView({
  onConfirm,
  onCancel,
  originalPosition,
  maxDistance,
  currentPosition,
  onCurrentPositionChange,
}: CvmMapRepositioningViewProps) {
  return (
    <>
      <AdjustableLocationMarker
        reference={
          (originalPosition &&
            maxDistance && {
              position: originalPosition,
              maxDistance,
            }) ||
          undefined
        }
        position={currentPosition}
        onAdapt={onCurrentPositionChange}
      />
      <ConfirmRegisterBottomNavigation
        onCancel={onCancel}
        onConfirm={onConfirm}
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
  const [repositioningId, setRepositioningId] = useState<string>();
  const [repositioningEditorPosition, setRepositioningEditorPosition] =
    useState<Leaflet.LatLng>();
  const [origRepositioningPosition, setOrigRepositioningPosition] =
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
    },
    [setIsRegistering, setRegisterPosition],
  );

  const onReposition = useCallback(
    (id: string, position: Leaflet.LatLng, editorPosition: Leaflet.LatLng) => {
      setIsRepositioning(true);
      setRepositioningId(id);
      setRepositioningEditorPosition(editorPosition);
      setOrigRepositioningPosition(position);
      setRepositioningPosition(position);
      map?.setView(position, 19);
    },
    [
      setIsRepositioning,
      setRepositioningEditorPosition,
      setOrigRepositioningPosition,
      setRepositioningPosition,
      setRepositioningId,
      map,
    ],
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
        <CvmMapRegisteringView
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
        <CvmMapRepositioningView
          onCancel={() => setIsRepositioning(false)}
          onConfirm={() => {
            props.onReposition?.(
              repositioningId!,
              repositioningPosition!,
              repositioningEditorPosition!,
            );
            setIsRepositioning(false);
          }}
          originalPosition={origRepositioningPosition}
          maxDistance={25}
          onCurrentPositionChange={setRepositioningPosition}
          currentPosition={repositioningPosition!}
        />
      )}
    </LeafletMap>
  );
}
