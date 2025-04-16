"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Leaflet from "leaflet";
import { TileLayer, useMapEvents, Marker, useMap } from "react-leaflet";
import { LocateControl } from "leaflet.locatecontrol";

import styles from "./LeafletMap.module.css";

import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

function LocateControlPlugin() {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const locateControl = new LocateControl({
        position: "topleft",
      });

      map.addControl(locateControl);

      return () => {
        map.removeControl(locateControl);
      };
    }
  }, [map]);

  return null;
}

const LeafletMapContainer = dynamic(
  () =>
    import("./LeafletMapContainer").then(
      (module) => module.LeafletMapContainer,
    ),
  { ssr: false },
);

interface LeafletMapEventHandlerProps {
  onZoomStart?: (event: Leaflet.LeafletEvent) => void;
  onZoomEnd?: (event: Leaflet.LeafletEvent) => void;
  onMoveStart?: (event: Leaflet.LeafletEvent) => void;
  onMoveEnd?: (event: Leaflet.LeafletEvent) => void;
}

function LeafletMapEventHandler(params: LeafletMapEventHandlerProps) {
  useMapEvents({
    zoomstart: (event) => params.onZoomStart?.(event),
    zoomend: (event) => params.onZoomEnd?.(event),
    movestart: (event) => params.onMoveStart?.(event),
    moveend: (event) => params.onMoveEnd?.(event),
  });

  return null;
}

export interface LeafletMapProps {
  children?: React.ReactNode;
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
  onReady?: (map: Leaflet.Map) => void;
  onZoomStart?: (event: Leaflet.LeafletEvent) => void;
  onZoomEnd?: (event: Leaflet.LeafletEvent) => void;
  onMoveStart?: (event: Leaflet.LeafletEvent) => void;
  onMoveEnd?: (event: Leaflet.LeafletEvent) => void;
}

export function LeafletMap(props: LeafletMapProps) {
  const [map, setMap] = useState<Leaflet.Map | null>(null);

  const {
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

  useEffect(() => {
    if (map) {
      props.onReady?.(map);
    }
  }, [map]);

  return (
    <div className={`relative flex h-full w-full ${className}`}>
      <LeafletMapContainer
        ref={setMap}
        center={center}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
        <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl} />
        <LocateControlPlugin />
        <LeafletMapEventHandler
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
        {props.children}
      </LeafletMapContainer>
    </div>
  );
}
