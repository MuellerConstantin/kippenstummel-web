import Leaflet from "leaflet";
import { Marker, Popup } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { MapPin } from "lucide-react";

interface ClusterMarkerProps {
  position: [number, number];
}

export function LocationMarker(props: ClusterMarkerProps) {
  return (
    <Marker
      position={Leaflet.latLng(props.position[0], props.position[1])}
      icon={LeafletDivIcon({
        source: (
          <div className="z-[50] h-fit w-fit">
            <MapPin className="h-8 w-8 fill-green-600 text-white" />
          </div>
        ),
        anchor: Leaflet.point(20, 20),
      })}
    >
      <Popup>
        <div className="space-y-1">
          <div className="text-md font-semibold">Location</div>
          <div className="text-xs">
            {props.position[0].toFixed(7)} / {props.position[1].toFixed(7)}{" "}
            (lat/lng)
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
