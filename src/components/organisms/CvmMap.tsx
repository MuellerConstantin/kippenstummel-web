"use client";

import { useState, useCallback, useEffect } from "react";
import { LeafletEvent, Map as LeafletMap } from "leaflet";
import useSWR from "swr";
import useApi from "@/hooks/useApi";
import { Map as MapComponent } from "@/components/organisms/Map";

export function CvmMap() {
  const api = useApi();

  const [map, setMap] = useState<LeafletMap | null>(null);
  const [bottomLeft, setBottomLeft] = useState<[number, number]>();
  const [topRight, setTopRight] = useState<[number, number]>();

  useEffect(() => {
    if (map) {
      const mapBounds = map.getBounds();

      setBottomLeft([
        mapBounds.getSouthWest().lat,
        mapBounds.getSouthWest().lng,
      ]);
      setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
    }
  }, [map]);

  const onZoomEnd = useCallback((event: LeafletEvent) => {
    const map = event.target as LeafletMap;
    const mapBounds = map.getBounds();

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
  }, []);

  const onMoveEnd = useCallback((event: LeafletEvent) => {
    const map = event.target as LeafletMap;
    const mapBounds = map.getBounds();

    setBottomLeft([mapBounds.getSouthWest().lat, mapBounds.getSouthWest().lng]);
    setTopRight([mapBounds.getNorthEast().lat, mapBounds.getNorthEast().lng]);
  }, []);

  const { data } = useSWR<
    { id: string; longitude: number; latitude: number }[],
    any,
    string | null
  >(
    !!bottomLeft && !!topRight
      ? `/cvm/within?bottomLeft=${bottomLeft?.[0]},${bottomLeft?.[1]}&topRight=${topRight?.[0]},${topRight?.[1]}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true },
  );

  return (
    <MapComponent
      ref={setMap}
      tileLayerUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      tileLayerAttribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      center={[49.006889, 8.403653]}
      zoom={14}
      onMoveEnd={onMoveEnd}
      onZoomEnd={onZoomEnd}
      markers={data?.map((cvm) => ({
        position: [cvm.latitude, cvm.longitude],
        id: cvm.id,
      }))}
    />
  );
}
