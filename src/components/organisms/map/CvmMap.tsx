"use client";

import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import Leaflet from "leaflet";
import { useTranslations } from "next-intl";
import useApi from "@/hooks/useApi";
import { DialogTrigger } from "react-aria-components";
import { LeafletMap } from "@/components/organisms/leaflet/LeafletMap";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";
import { Modal } from "@/components/atoms/Modal";
import { LocateControlPlugin } from "./LocateControl";
import { ReportCvmControlPlugin } from "./ReportCvmControl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { ConfirmCvmReportDialog } from "./ConfirmCvmReportDialog";
import { useAppDispatch, useAppSelector } from "@/store";
import locationSlice from "@/store/slices/location";

export interface CvmMapProps {
  onReport?: (position: Leaflet.LatLng) => void;
  onUpvote?: (id: string, position: Leaflet.LatLng) => void;
  onDownvote?: (id: string, position: Leaflet.LatLng) => void;
}

export function CvmMap(props: CvmMapProps) {
  const t = useTranslations();
  const api = useApi();
  const dispatch = useAppDispatch();
  const { enqueue } = useNotifications();

  const location = useAppSelector((state) => state.location.location);
  const [showReportConfirmDialog, setShowReportConfirmDialog] = useState(false);
  const [zoom, setZoom] = useState<number>();
  const [bottomLeft, setBottomLeft] = useState<[number, number]>();
  const [topRight, setTopRight] = useState<[number, number]>();

  const onReady = useCallback((map: Leaflet.Map) => {
    const mapBounds = map.getBounds();

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
    setZoom(map.getZoom());
  }, []);

  const onZoomEnd = useCallback((event: Leaflet.LeafletEvent) => {
    const map = event.target as Leaflet.Map;
    const mapBounds = map.getBounds();

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
    setZoom(map.getZoom());
  }, []);

  const onMoveEnd = useCallback((event: Leaflet.LeafletEvent) => {
    const map = event.target as Leaflet.Map;
    const mapBounds = map.getBounds();

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
    setZoom(map.getZoom());
  }, []);

  const onLocationFound = useCallback(
    (event: Leaflet.LeafletEvent) => {
      const position = (event as Leaflet.LocationEvent).latlng;

      dispatch(
        locationSlice.actions.setLocation({
          lat: position.lat,
          lng: position.lng,
        }),
      );
    },
    [dispatch],
  );

  const onLocationError = useCallback(() => {
    enqueue({
      title: t("Notifications.locationDeterminationFailed.title"),
      description: t("Notifications.locationDeterminationFailed.description"),
      variant: "error",
    });
  }, [enqueue, t]);

  const { data } = useSWR<
    (
      | { id: string; longitude: number; latitude: number; score: number }
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
    !!bottomLeft && !!topRight && !!zoom
      ? `/cvms?bottomLeft=${bottomLeft?.[0]},${bottomLeft?.[1]}&topRight=${topRight?.[0]},${topRight?.[1]}&zoom=${zoom}`
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

  return (
    <LeafletMap
      tileLayerUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      tileLayerAttribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      center={[49.006889, 8.403653]}
      zoom={14}
      minZoom={8}
      maxZoom={17}
      onReady={onReady}
      onMoveEnd={onMoveEnd}
      onZoomEnd={onZoomEnd}
      onLocationFound={onLocationFound}
      onLocationError={onLocationError}
    >
      <LocateControlPlugin position="topleft" />
      <ReportCvmControlPlugin
        position="bottomright"
        onReport={() => setShowReportConfirmDialog(true)}
      />
      <DialogTrigger
        isOpen={showReportConfirmDialog}
        onOpenChange={setShowReportConfirmDialog}
      >
        <Modal>
          <ConfirmCvmReportDialog
            onConfirm={() =>
              props.onReport?.(new Leaflet.LatLng(location!.lat, location!.lng))
            }
          />
        </Modal>
      </DialogTrigger>
      {markers?.map((marker) => (
        <LocationMarker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          score={marker.score}
          onUpvote={(voterPosition) =>
            props.onUpvote?.(marker.id, voterPosition)
          }
          onDownvote={(voterPosition) =>
            props.onDownvote?.(marker.id, voterPosition)
          }
        />
      ))}
      {clusters?.map((marker, index) => (
        <ClusterMarker
          key={index}
          position={[marker.latitude, marker.longitude]}
          count={marker.count}
        />
      ))}
      {location && <LocateMarker position={[location.lat, location.lng]} />}
    </LeafletMap>
  );
}
