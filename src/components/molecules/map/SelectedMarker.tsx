import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { MapPin } from "lucide-react";

interface SelectedMarkerProps {
  cvm: {
    id: string;
    latitude: number;
    longitude: number;
  };
}

export function SelectedMarker(props: SelectedMarkerProps) {
  return (
    <>
      <Marker
        position={Leaflet.latLng(props.cvm.latitude, props.cvm.longitude)}
        icon={LeafletDivIcon({
          source: (
            <div className="relative z-[50] h-fit w-fit">
              <MapPin className="h-[32px] w-[32px] fill-[#EA4335] text-[#A52714]" />
            </div>
          ),
          size: Leaflet.point(32, 32),
          anchor: Leaflet.point(16, 24),
        })}
      />
    </>
  );
}
