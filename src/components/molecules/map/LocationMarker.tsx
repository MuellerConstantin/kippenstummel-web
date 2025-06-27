import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { MapPin, ChevronUp, ChevronDown, Equal } from "lucide-react";

interface LocationMarkerProps {
  cvm: {
    id: string;
    latitude: number;
    longitude: number;
    score: number;
  };
  onSelect: () => void;
}

export function LocationMarker(props: LocationMarkerProps) {
  return (
    <>
      <Marker
        position={Leaflet.latLng(props.cvm.latitude, props.cvm.longitude)}
        icon={LeafletDivIcon({
          source: (
            <div className="relative z-[50] h-fit w-fit">
              {props.cvm.score < -99 ? (
                <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500">
                  <ChevronDown className="h-2.5 w-2.5 text-white" />
                </div>
              ) : props.cvm.score > 99 ? (
                <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-600">
                  <ChevronUp className="h-2.5 w-2.5 text-white" />
                </div>
              ) : (
                <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-500">
                  <Equal className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <MapPin className="h-[32px] w-[32px] fill-green-600 text-white" />
            </div>
          ),
          size: Leaflet.point(32, 32),
          anchor: Leaflet.point(16, 24),
        })}
        eventHandlers={{
          click: () => {
            props.onSelect();
          },
        }}
      />
    </>
  );
}
