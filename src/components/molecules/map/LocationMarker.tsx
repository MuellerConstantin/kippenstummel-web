import { MapPin, ChevronUp, ChevronDown, Equal, X } from "lucide-react";
import { Cvm } from "@/lib/types/cvm";
import { Marker } from "react-map-gl/maplibre";
import {
  SCORING_DELETION_UPPER_LIMIT,
  SCORING_GOOD_LOWER_LIMIT,
  SCORING_NEUTRAL_LOWER_LIMIT,
} from "@/lib/constants";

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
        {props.cvm.score <= SCORING_DELETION_UPPER_LIMIT ? (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-800">
            <X className="h-2.5 w-2.5 text-white" />
          </div>
        ) : props.cvm.score < SCORING_NEUTRAL_LOWER_LIMIT ? (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500">
            <ChevronDown className="h-2.5 w-2.5 text-white" />
          </div>
        ) : props.cvm.score >= SCORING_GOOD_LOWER_LIMIT ? (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-600">
            <ChevronUp className="h-2.5 w-2.5 text-white" />
          </div>
        ) : (
          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-500">
            <Equal className="h-2.5 w-2.5 text-white" />
          </div>
        )}
        <MapPin className="h-[32px] w-[32px] fill-green-600 text-white dark:text-slate-600" />
      </div>
    </Marker>
  );
}
