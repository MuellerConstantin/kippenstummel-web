import { MapPin, ChevronUp, ChevronDown, Equal, X } from "lucide-react";
import { Cvm } from "@/lib/types/cvm";
import { Marker } from "react-map-gl/maplibre";

interface LocationMarkerProps {
  cvm: Cvm;
  onSelect: () => void;
}

export function LocationMarker(props: LocationMarkerProps) {
  return (
    <Marker
      latitude={props.cvm.latitude}
      longitude={props.cvm.longitude}
      onClick={props.onSelect}
      className="cursor-pointer"
      anchor="bottom"
    >
      <div className="relative z-[50] h-fit w-fit">
        {props.cvm.score < -8 ? (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-800">
            <X className="h-2.5 w-2.5 text-white" />
          </div>
        ) : props.cvm.score < 0 ? (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500">
            <ChevronDown className="h-2.5 w-2.5 text-white" />
          </div>
        ) : props.cvm.score >= 5 ? (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-600">
            <ChevronUp className="h-2.5 w-2.5 text-white" />
          </div>
        ) : (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-500">
            <Equal className="h-2.5 w-2.5 text-white" />
          </div>
        )}
        <MapPin className="h-[36px] w-[36px] fill-green-600 text-white dark:text-slate-600" />
      </div>
    </Marker>
  );
}
