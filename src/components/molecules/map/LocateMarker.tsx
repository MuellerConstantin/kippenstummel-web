import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";

interface LocateMarkerProps {
  position: Leaflet.LatLng;
}

export function LocateMarker(props: LocateMarkerProps) {
  return (
    <Marker
      position={Leaflet.latLng(props.position.lat, props.position.lng)}
      icon={LeafletDivIcon({
        source: (
          <div className="relative !z-[2000] flex h-[20px] w-[20px]">
            <div className="absolute inline-flex h-full w-full animate-[ping_1.5s_linear_infinite] rounded-full bg-blue-400 opacity-75" />
            <div className="relative inline-flex h-full w-full rounded-full border-2 border-white bg-blue-500" />
          </div>
        ),
        size: Leaflet.point(20, 20),
        anchor: Leaflet.point(10, 10),
        className: "!z-[2000]",
      })}
    />
  );
}
