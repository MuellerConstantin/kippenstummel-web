"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import useSWR from "swr";
import Leaflet from "leaflet";
import { Circle } from "react-leaflet";
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
import { useAppDispatch, useAppSelector } from "@/store";
import locationSlice from "@/store/slices/location";
import usabilitySlice from "@/store/slices/usability";
import { MenuBottomNavigation } from "./MenuBottomNavigation";
import { FilterDialog } from "./FilterDialog";
import { AdjustableLocationMarker } from "@/components/molecules/map/AdjustableLocationMarker";
import { ConfirmRegisterBottomNavigation } from "./ConfirmRegisterBottomNavigation";

export interface CvmMapProps {
  onRegister?: (position: Leaflet.LatLng) => void;
  onReposition?: (
    id: string,
    position: Leaflet.LatLng,
    editorPosition: Leaflet.LatLng,
  ) => void;
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
  const mapView = useAppSelector((state) => state.usability.mapView);

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
      map?.setView(position, 18);
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

  useEffect(() => {
    if (props.selectedCvm) {
      map?.setView(
        [props.selectedCvm.latitude, props.selectedCvm.longitude],
        18,
      );
    }
  }, [props.selectedCvm, map]);

  if (!mapView) {
    return null;
  }

  return (
    <LeafletMap
      tileLayerUrl="/api/mtp/{z}/{x}/{y}.png"
      tileLayerAttribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      center={mapView.center}
      zoom={mapView.zoom}
      minZoom={12}
      maxZoom={18}
      onReady={onReady}
      onMoveEnd={onMoveEnd}
      onZoomEnd={onZoomEnd}
      onLocationFound={onLocationFound}
      onLocationError={onLocationError}
    >
      <LocateControlPlugin position="topleft" />
      {isRegistering && (
        <>
          <AdjustableLocationMarker
            reference={{
              position: [location!.lat, location!.lng],
              maxDistance: 25,
            }}
            position={[registerPosition!.lat, registerPosition!.lng]}
            onAdapt={setRegisterPosition}
          />
          <Circle
            radius={25}
            center={[location!.lat, location!.lng]}
            pathOptions={{ color: "#16a34a", fillColor: "#16a34a" }}
          />
          <ConfirmRegisterBottomNavigation
            onCancel={() => setIsRegistering(false)}
            onConfirm={() => {
              props.onRegister?.(registerPosition!);
              setIsRegistering(false);
            }}
          />
        </>
      )}
      {isRepositioning && (
        <>
          <AdjustableLocationMarker
            reference={{
              position: [
                origRepositioningPosition!.lat,
                origRepositioningPosition!.lng,
              ],
              maxDistance: 25,
            }}
            position={[repositioningPosition!.lat, repositioningPosition!.lng]}
            onAdapt={setRepositioningPosition}
          />
          <Circle
            radius={25}
            center={[
              origRepositioningPosition!.lat,
              origRepositioningPosition!.lng,
            ]}
            pathOptions={{ color: "#16a34a", fillColor: "#16a34a" }}
          />
          <ConfirmRegisterBottomNavigation
            onCancel={() => setIsRepositioning(false)}
            onConfirm={() => {
              props.onReposition?.(
                repositioningId!,
                repositioningPosition!,
                repositioningEditorPosition!,
              );
              setIsRepositioning(false);
            }}
          />
        </>
      )}
      {!isRegistering && !isRepositioning && (
        <>
          <DialogTrigger
            isOpen={showHelpDialog}
            onOpenChange={setShowHelpDialog}
          >
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
          {markers?.map((marker) => (
            <LocationMarker
              key={marker.id}
              id={marker.id}
              position={new Leaflet.LatLng(marker.latitude, marker.longitude)}
              score={marker.score}
              onUpvote={(voterPosition) =>
                props.onUpvote?.(marker.id, voterPosition)
              }
              onDownvote={(voterPosition) =>
                props.onDownvote?.(marker.id, voterPosition)
              }
              onReposition={onReposition}
              selected={marker.id === props.selectedCvm?.id}
            />
          ))}
          {clusters?.map((marker, index) => (
            <ClusterMarker
              key={index}
              position={new Leaflet.LatLng(marker.latitude, marker.longitude)}
              count={marker.count}
            />
          ))}
          <MenuBottomNavigation
            map={map!}
            onHelp={onHelp}
            onFilter={onFilter}
            onRegister={onRegister}
          />
        </>
      )}
      {location && (
        <LocateMarker
          position={new Leaflet.LatLng(location.lat, location.lng)}
        />
      )}
    </LeafletMap>
  );
}
