import Leaflet from "leaflet";
import { Marker } from "react-leaflet";

interface ClusterMarkerProps {
  position: [number, number];
}

export function LocationMarker(props: ClusterMarkerProps) {
  return (
    <Marker position={Leaflet.latLng(props.position[0], props.position[1])} />
  );
}
