"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useSWR from "swr";
import Leaflet from "leaflet";
import { AttributionControl, ZoomControl } from "react-leaflet";
import { useTranslations } from "next-intl";
import useApi from "@/hooks/useApi";
import { LeafletMap } from "@/components/organisms/leaflet/LeafletMap";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";
import { Modal } from "@/components/atoms/Modal";
import { LocateControlPlugin } from "./LocateControl";
import { HelpDialog } from "./HelpDialog";
import { useNotifications } from "@/contexts/NotificationProvider";
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
import { latLonToTile, tileToLatLon } from "@/lib/geo";

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
  const api = useApi();
  const dispatch = useAppDispatch();
  const { enqueue } = useNotifications();

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

  const location = useAppSelector((state) => state.location.location);
  const locatedAt = useAppSelector((state) => state.location.locatedAt);
  const mapView = useAppSelector((state) => state.usability.mapView);
  const mapFilters = useAppSelector((state) => state.usability.mapFilters);

  const mapFilterQuery = useMemo(() => {
    if (!mapFilters) {
      return undefined;
    } else {
      const appliedFilters: string[] = [];

      if (mapFilters.score) {
        if (mapFilters.score.min !== undefined) {
          appliedFilters.push(`score >= ${mapFilters.score.min}`);
        }

        if (mapFilters.score.max !== undefined) {
          appliedFilters.push(`score <= ${mapFilters.score.max}`);
        }
      }

      const finalFilter = appliedFilters.filter(Boolean).join(" and ");
      return finalFilter.length > 0 ? finalFilter : undefined;
    }
  }, [mapFilters]);

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);

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

  const [isReporting, setIsReporting] = useState(false);
  const [reportingId, setReportingId] = useState<string>();
  const [reportingPosition, setReportingPosition] = useState<Leaflet.LatLng>();

  const [map, setMap] = useState<Leaflet.Map | null>(null);
  const [zoom, setZoom] = useState<number>();
  const [bottomLeft, setBottomLeft] = useState<[number, number]>();
  const [topRight, setTopRight] = useState<[number, number]>();

  const normalizedZoom = useMemo(() => {
    if (zoom == null || zoom == undefined) return undefined;
    return zoom > 18 ? 18 : zoom;
  }, [zoom]);

  /**
   * The normalized bottom left coordinates. The coordinates are normalized
   * to the lower left corner of the tile that contains the given coordinates.
   */
  const normalizedBottomLeft = useMemo(() => {
    if (!bottomLeft || zoom == null || zoom == undefined) return undefined;

    const [lat, lon] = bottomLeft;
    const { x, y, z } = latLonToTile(lat, lon, zoom);

    const { latitude: normalizedLat, longitude: normalizedLon } = tileToLatLon(
      x,
      y + 1,
      z,
    );

    return [normalizedLat, normalizedLon];
  }, [bottomLeft, zoom]);

  /**
   * The normalized top right coordinates. The coordinates are normalized
   * to the upper right corner of the tile that contains the given coordinates.
   */
  const normalizedTopRight = useMemo(() => {
    if (!topRight || zoom == null || zoom == undefined) return undefined;

    const [lat, lon] = topRight;
    const { x, y, z } = latLonToTile(lat, lon, zoom);

    const { latitude: normalizedLat, longitude: normalizedLon } = tileToLatLon(
      x + 1,
      y,
      z,
    );

    return [normalizedLat, normalizedLon];
  }, [topRight, zoom]);

  /* ============ Data Fetching - Start ============ */

  const { data } = useSWR<
    (
      | {
          id: string;
          longitude: number;
          latitude: number;
          score: number;
          recentlyReported: {
            missing: number;
            spam: number;
            inactive: number;
            inaccessible: number;
          };
          alreadyVoted?: "upvote" | "downvote";
        }
      | {
          id: string;
          cluster: true;
          longitude: number;
          latitude: number;
          count: number;
        }
    )[],
    unknown,
    string | null
  >(
    !!normalizedBottomLeft && !!normalizedTopRight && !!normalizedZoom
      ? `/cvms?bottomLeft=${normalizedBottomLeft?.[0]},${normalizedBottomLeft?.[1]}&topRight=${normalizedTopRight?.[0]},${normalizedTopRight?.[1]}&zoom=${normalizedZoom}${mapFilterQuery ? `&filter=${mapFilterQuery}` : ""}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true },
  );

  const markers = useMemo(
    () =>
      data?.filter((item) => !("cluster" in item)) as {
        id: string;
        longitude: number;
        latitude: number;
        score: number;
        recentlyReported: {
          missing: number;
          spam: number;
          inactive: number;
          inaccessible: number;
        };
        alreadyVoted?: "upvote" | "downvote";
      }[],
    [data],
  );

  const clusters = useMemo(
    () =>
      data?.filter((item) => "cluster" in item) as {
        id: string;
        cluster: true;
        longitude: number;
        latitude: number;
        count: number;
      }[],
    [data],
  );

  /* ============ Data Fetching - End ============ */

  const onReady = useCallback((map: Leaflet.Map) => {
    const mapBounds = map.getBounds();

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
    setZoom(map.getZoom());

    setMap(map);
  }, []);

  const onZoomEnd = useCallback(
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

  const onMoveEnd = useCallback(
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

  const onHelp = useCallback(() => {
    setShowHelpDialog(true);
  }, [setShowHelpDialog]);

  const onFilter = useCallback(() => {
    setShowFilterDialog(true);
  }, [setShowFilterDialog]);

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

  /* ============ CVM-Selection - Start ============ */

  const [selectedCvmId, setSelectedCvmId] = useState<string | null>(null);
  const appliedSharedIdRef = useRef<string | null>(null);

  // Sets the shared CVM once when rendering the map if a shared CVM link was followed
  useEffect(() => {
    if (props.sharedCvmId && appliedSharedIdRef.current !== props.sharedCvmId) {
      setSelectedCvmId(props.sharedCvmId);
      // Ensure that the sharedCvmId is only applied once
      appliedSharedIdRef.current = props.sharedCvmId;
    }
  }, [props.sharedCvmId, map]);

  const { data: selectedCvmData, error: selectedCvmError } = useSWR<
    {
      id: string;
      latitude: number;
      longitude: number;
      score: number;
      recentlyReported: {
        missing: number;
        spam: number;
        inactive: number;
        inaccessible: number;
      };
    },
    unknown,
    string | null
  >(
    selectedCvmId ? `/cvms/${selectedCvmId}` : null,
    (url) => api.get(url).then((res) => res.data),
    { shouldRetryOnError: false, revalidateOnFocus: false },
  );

  // Determine the selected CVM
  const selectedCvm = useMemo(() => {
    if (!selectedCvmId) {
      return null;
    }

    return selectedCvmData || null;
  }, [selectedCvmData, selectedCvmId]);

  // Show a notification if the shared CVM is not found
  useEffect(() => {
    if (selectedCvmError) {
      if (appliedSharedIdRef.current) {
        enqueue(
          {
            title: t("Notifications.sharedNotFound.title"),
            description: t("Notifications.sharedNotFound.description"),
            variant: "error",
          },
          { timeout: 10000 },
        );
      } else {
        enqueue(
          {
            title: t("Notifications.selectedNotFound.title"),
            description: t("Notifications.selectedNotFound.description"),
            variant: "error",
          },
          { timeout: 10000 },
        );
      }
    }
  }, [selectedCvmError, enqueue, t]);

  // Center the map on the shared CVM, only for the first render of shared CVM
  useEffect(() => {
    /*
     * It's important to check for the selectedCvm?.latitude and selectedCvm?.longitude
     * because the selectedCvm object reference may change every time, the viewport is moved
     * because the markers array change, which in turn causes a change of the selectedCvm reference.
     * But this doesn't necessarily means that the selectedCvm itself has changed.
     */

    if (
      selectedCvm?.latitude &&
      selectedCvm?.longitude &&
      appliedSharedIdRef.current &&
      appliedSharedIdRef.current === selectedCvmId
    ) {
      map?.setView([selectedCvm.latitude, selectedCvm.longitude], 18);
    }
  }, [selectedCvm?.latitude, selectedCvm?.longitude, map, selectedCvmId]);

  /* ============ CVM-Selection - End ============ */

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
      onMoveEnd={onMoveEnd}
      onZoomEnd={onZoomEnd}
    >
      <MapLibreTileLayer url="/tiles/default.json" />
      <AttributionControl prefix={false} />
      <ZoomControl position="topright" zoomInTitle="" zoomOutTitle="" />
      <LocateControlPlugin position="topright" />
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
      {!isRegistering && !isRepositioning && (
        <>
          <div className="absolute flex h-full w-full">
            <div ref={sidebarRef} className="z-[2000] h-full shrink-0">
              <CvmInfoDialog
                open={!!selectedCvm}
                onOpenChange={(open) =>
                  setSelectedCvmId(open ? selectedCvmId : null)
                }
                cvm={selectedCvm!}
                onUpvote={(voterPosition) =>
                  props.onUpvote?.(selectedCvm!.id, voterPosition)
                }
                onDownvote={(voterPosition) =>
                  props.onDownvote?.(selectedCvm!.id, voterPosition)
                }
                onReposition={(editorPosition) =>
                  onReposition(
                    selectedCvm!.id,
                    Leaflet.latLng(
                      selectedCvm!.latitude,
                      selectedCvm!.longitude,
                    ),
                    editorPosition,
                  )
                }
                onReport={(reporterPosition) => {
                  setIsReporting(true);
                  setReportingId(selectedCvm!.id);
                  setReportingPosition(reporterPosition);
                  setSelectedCvmId(null);
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
            {isReporting && (
              <Modal
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                isOpen={isReporting}
                onOpenChange={setIsReporting}
              >
                <CvmReportDialog
                  onReport={(type) => {
                    props.onReport?.(reportingId!, reportingPosition!, type);
                    setIsReporting(false);
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
                onSelect={() => setSelectedCvmId(marker.id)}
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
      )}
      {location && (
        <LocateMarker
          position={new Leaflet.LatLng(location.lat, location.lng)}
          lastUpdatedAgo={new Date().getTime() - new Date(locatedAt!).getTime()}
        />
      )}
    </LeafletMap>
  );
}
