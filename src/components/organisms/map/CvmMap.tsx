"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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
import { HelpDialog } from "./HelpDialog";
import { useNotifications } from "@/contexts/NotificationProvider";
import { ConfirmCvmRegisterDialog } from "./ConfirmCvmRegisterDialog";
import { useAppDispatch, useAppSelector } from "@/store";
import locationSlice from "@/store/slices/location";
import { BottomNavigation } from "./BottomNavigation";
import { FilterDialog } from "./FilterDialog";

export interface CvmMapProps {
  onRegister?: (position: Leaflet.LatLng) => void;
  onUpvote?: (id: string, position: Leaflet.LatLng) => void;
  onDownvote?: (id: string, position: Leaflet.LatLng) => void;
  selectedCvm?: {
    id: string;
    longitude: number;
    latitude: number;
    score: number;
  } | null;
}

export function CvmMap(props: CvmMapProps) {
  const t = useTranslations();
  const api = useApi();
  const dispatch = useAppDispatch();
  const { enqueue } = useNotifications();

  const location = useAppSelector((state) => state.location.location);
  const mapVariant = useAppSelector((state) => state.usability.mapVariant);

  const [showRegisterConfirmDialog, setShowRegisterConfirmDialog] =
    useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const [map, setMap] = useState<Leaflet.Map | null>(null);
  const [zoom, setZoom] = useState<number>();
  const [bottomLeft, setBottomLeft] = useState<[number, number]>();
  const [topRight, setTopRight] = useState<[number, number]>();

  const onReady = useCallback((map: Leaflet.Map) => {
    const mapBounds = map.getBounds();

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
    setZoom(map.getZoom());

    setMap(map);
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

  const onLocationError = useCallback(
    (event: Leaflet.ErrorEvent) => {
      let title = "";
      let description = "";

      const PERMISSION_DENIED = 1;
      const POSITION_UNAVAILABLE = 2;
      const TIMEOUT = 3;

      switch (event.code) {
        case PERMISSION_DENIED:
          title = t(
            "Notifications.locationDeterminationFailed.permissionDenied.title",
          );
          description = t(
            "Notifications.locationDeterminationFailed.permissionDenied.description",
          );
          break;
        case POSITION_UNAVAILABLE:
          title = t(
            "Notifications.locationDeterminationFailed.unavailable.title",
          );
          description = t(
            "Notifications.locationDeterminationFailed.unavailable.description",
          );
          break;
        case TIMEOUT:
          title = t("Notifications.locationDeterminationFailed.timeout.title");
          description = t(
            "Notifications.locationDeterminationFailed.timeout.description",
          );
          break;
        default:
          title = t("Notifications.locationDeterminationFailed.default.title");
          description = t(
            "Notifications.locationDeterminationFailed.default.description",
          );
          break;
      }

      enqueue({
        title,
        description,
        variant: "error",
      });
    },
    [enqueue, t],
  );

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
    !!bottomLeft && !!topRight && !!zoom && !!mapVariant
      ? `/cvms?bottomLeft=${bottomLeft?.[0]},${bottomLeft?.[1]}&topRight=${topRight?.[0]},${topRight?.[1]}&zoom=${zoom}&variant=${mapVariant}`
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

  const onHelp = useCallback(() => {
    setShowHelpDialog(true);
  }, [setShowHelpDialog]);

  const onFilter = useCallback(() => {
    setShowFilterDialog(true);
  }, [setShowFilterDialog]);

  const onRegister = useCallback(() => {
    setShowRegisterConfirmDialog(true);
  }, [setShowRegisterConfirmDialog]);

  useEffect(() => {
    if (props.selectedCvm) {
      map?.setView(
        [props.selectedCvm.latitude, props.selectedCvm.longitude],
        18,
      );
    }
  }, [props.selectedCvm, map]);

  return (
    <LeafletMap
      tileLayerUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      tileLayerAttribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      center={[49.006889, 8.403653]}
      zoom={14}
      minZoom={12}
      maxZoom={18}
      onReady={onReady}
      onMoveEnd={onMoveEnd}
      onZoomEnd={onZoomEnd}
      onLocationFound={onLocationFound}
      onLocationError={onLocationError}
    >
      <LocateControlPlugin position="topleft" />
      <DialogTrigger isOpen={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <Modal className="max-w-2xl">
          <HelpDialog />
        </Modal>
      </DialogTrigger>
      <DialogTrigger
        isOpen={showFilterDialog}
        onOpenChange={setShowFilterDialog}
      >
        <Modal>
          <FilterDialog />
        </Modal>
      </DialogTrigger>
      <DialogTrigger
        isOpen={showRegisterConfirmDialog}
        onOpenChange={setShowRegisterConfirmDialog}
      >
        <Modal>
          <ConfirmCvmRegisterDialog
            onConfirm={() =>
              props.onRegister?.(
                new Leaflet.LatLng(location!.lat, location!.lng),
              )
            }
          />
        </Modal>
      </DialogTrigger>
      {markers?.map((marker) => (
        <LocationMarker
          key={marker.id}
          id={marker.id}
          position={[marker.latitude, marker.longitude]}
          score={marker.score}
          onUpvote={(voterPosition) =>
            props.onUpvote?.(marker.id, voterPosition)
          }
          onDownvote={(voterPosition) =>
            props.onDownvote?.(marker.id, voterPosition)
          }
          selected={marker.id === props.selectedCvm?.id}
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
      <BottomNavigation
        map={map!}
        onHelp={onHelp}
        onFilter={onFilter}
        onRegister={onRegister}
      />
    </LeafletMap>
  );
}
