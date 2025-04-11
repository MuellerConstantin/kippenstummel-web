"use client";

import dynamic from "next/dynamic";
import { TileLayer } from "react-leaflet";

const DynamicMap = dynamic(
  () => import("./DynamicMap").then((m) => m.DynamicMap),
  { ssr: false },
);

export interface MapProps {
  tileLayerUrl: string;
  tileLayerAttribution: string;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function Map(props: MapProps) {
  const {
    className,
    tileLayerUrl,
    tileLayerAttribution,
    center = [52.520008, 13.404954],
    zoom = 10,
  } = props;

  return (
    <div className={`relative flex h-full w-full ${className}`}>
      <DynamicMap center={center} zoom={zoom}>
        <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl} />
      </DynamicMap>
    </div>
  );
}
