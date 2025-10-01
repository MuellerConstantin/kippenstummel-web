import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { MapPin } from "lucide-react";
import { Cvm } from "@/lib/types/cvm";

interface SelectedMarkerProps {
  cvm: Cvm;
}

export function SelectedMarker(props: SelectedMarkerProps) {
  return (
    <Marker
      position={Leaflet.latLng(props.cvm.latitude, props.cvm.longitude)}
      icon={LeafletDivIcon({
        source: (
          <div className="relative z-[50] h-fit w-fit">
            <MapPin className="h-[36px] w-[36px] fill-[#EA4335] text-[#A52714]" />
          </div>
        ),
        size: Leaflet.point(36, 36),
        anchor: Leaflet.point(18, 26),
      })}
    />
  );
}
