import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";

interface LocateMarkerProps {
  position: [number, number];
}

export function LocateMarker(props: LocateMarkerProps) {
  return (
    <Marker
      position={Leaflet.latLng(props.position[0], props.position[1])}
      icon={LeafletDivIcon({
        source: (
          <div className="!z-[2000] h-[20px] w-[20px] rounded-full border-2 border-white bg-blue-500" />
        ),
        anchor: Leaflet.point(20, 20),
        className: "!z-[2000]",
      })}
    />
  );
}
