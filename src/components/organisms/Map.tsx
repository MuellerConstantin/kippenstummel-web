"use client";

import dynamic from "next/dynamic";
import { TileLayer, useMapEvents, Marker } from "react-leaflet";
import Leaflet, { LeafletEvent } from "leaflet";
import React from "react";

import styles from "./Map.module.css";

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
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  markers?: {
    position: [number, number];
    id: string;
  }[];
  clusters?: {
    position: [number, number];
    id: string;
    count: number;
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
    minZoom,
    maxZoom,
    markers,
    clusters,
  } = props;

  return (
    <div className={`relative flex h-full w-full ${className}`}>
      <DynamicMap
        ref={ref}
        center={center}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
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
        {clusters?.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={
              new Leaflet.DivIcon({
                html: `<div><span>${marker.count}</span></div>`,
                className: `${styles["marker-cluster"]} ${styles[`marker-cluster-${marker.count < 10 ? "small" : marker.count < 100 ? "medium" : "large"}`]}`,
                iconSize: Leaflet.point(40, 40),
              })
            }
          />
        ))}
      </DynamicMap>
    </div>
  );
}
