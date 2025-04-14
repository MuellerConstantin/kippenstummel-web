"use client";

import dynamic from "next/dynamic";
import { TileLayer, useMapEvents, Marker } from "react-leaflet";
import Leaflet, { LeafletEvent } from "leaflet";
import React from "react";

const DynamicMap = dynamic(
  () => import("./DynamicMap").then((m) => m.DynamicMap),
  { ssr: false },
);

interface MapEventHandlerProps {
  onZoomStart?: (event: LeafletEvent) => void;
  onZoomEnd?: (event: LeafletEvent) => void;
  onMoveStart?: (event: LeafletEvent) => void;
  onMoveEnd?: (event: LeafletEvent) => void;
}

function MapEventHandler(params: MapEventHandlerProps) {
  useMapEvents({
    zoomstart: (event) => params.onZoomStart?.(event),
    zoomend: (event) => params.onZoomEnd?.(event),
    movestart: (event) => params.onMoveStart?.(event),
    moveend: (event) => params.onMoveEnd?.(event),
  });

  return null;
}

export interface MapProps {
  ref?: React.Ref<Leaflet.Map>;
  tileLayerUrl: string;
  tileLayerAttribution: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
  markers?: {
    position: [number, number];
    id: string;
  }[];
  onZoomStart?: (event: LeafletEvent) => void;
  onZoomEnd?: (event: LeafletEvent) => void;
  onMoveStart?: (event: LeafletEvent) => void;
  onMoveEnd?: (event: LeafletEvent) => void;
}

export function Map(props: MapProps) {
  const {
    ref,
    className,
    tileLayerUrl,
    tileLayerAttribution,
    center,
    zoom,
    markers,
  } = props;

  return (
    <div className={`relative flex h-full w-full ${className}`}>
      <DynamicMap ref={ref} center={center} zoom={zoom}>
        <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl} />
        <MapEventHandler
          onZoomStart={props.onZoomStart}
          onZoomEnd={props.onZoomEnd}
          onMoveStart={props.onMoveStart}
          onMoveEnd={props.onMoveEnd}
        />
        {markers?.map((marker) => (
          <Marker key={marker.id} position={marker.position} />
        ))}
      </DynamicMap>
    </div>
  );
}
