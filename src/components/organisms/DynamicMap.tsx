import React from "react";
import { MapContainer, MapContainerProps } from "react-leaflet";

import "leaflet/dist/leaflet.css";

export interface DynamicMapProps extends MapContainerProps {}

export function DynamicMap(props: DynamicMapProps) {
  const { children, ...rest } = props;
  return (
    <MapContainer className="h-full w-full grow" {...rest}>
      {props.children}
    </MapContainer>
  );
}
