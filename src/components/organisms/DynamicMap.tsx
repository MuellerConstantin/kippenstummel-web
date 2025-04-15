import React, { useEffect } from "react";
import Leaflet from "leaflet";
import { MapContainer, MapContainerProps, useMap } from "react-leaflet";
import { LocateControl } from "leaflet.locatecontrol";

import "leaflet/dist/leaflet.css";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

interface MapPluginsProps {}

function MapPlugins(props: MapPluginsProps) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const locateControl = new LocateControl({
        position: "bottomright",
      });

      map.addControl(locateControl);

      return () => {
        map.removeControl(locateControl);
      };
    }
  }, [map]);

  return null;
}

export interface DynamicMapProps extends MapContainerProps {
  ref?: React.Ref<Leaflet.Map>;
}

export function DynamicMap(props: DynamicMapProps) {
  const { children, ref, ...rest } = props;

  useEffect(() => {
    (async function init() {
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "images/leaflet/marker-icon-2x.png",
        iconUrl: "images/leaflet/marker-icon.png",
        shadowUrl: "images/leaflet/marker-shadow.png",
      });
    })();
  }, []);

  return (
    <MapContainer ref={ref} className="h-full w-full grow" {...rest}>
      {props.children}
      <MapPlugins />
    </MapContainer>
  );
}
