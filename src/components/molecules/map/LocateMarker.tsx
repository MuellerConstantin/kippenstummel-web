import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { useMemo } from "react";
import { LOCATION_TTL } from "@/lib/constants";
import { GeoCoordinates } from "@/lib/types/geo";

interface LocateMarkerProps {
  position: GeoCoordinates;
  lastUpdatedAgo: number;
}

export function LocateMarker(props: LocateMarkerProps) {
  const highlightClass = useMemo(() => {
    if (props.lastUpdatedAgo < LOCATION_TTL) {
      return "bg-blue-500";
    } else {
      return "bg-slate-400 dark:bg-slate-600";
    }
  }, [props.lastUpdatedAgo]);

  const outlineClass = useMemo(() => {
    if (props.lastUpdatedAgo < LOCATION_TTL) {
      return "bg-blue-400";
    } else {
      return "bg-slate-300 dark:bg-slate-500";
    }
  }, [props.lastUpdatedAgo]);

  return (
    <Marker
      position={Leaflet.latLng(
        props.position.latitude,
        props.position.longitude,
      )}
      icon={LeafletDivIcon({
        source: (
          <div className="relative !z-[2000] flex h-[20px] w-[20px]">
            <div
              className={`absolute inline-flex h-full w-full animate-[ping_1.5s_linear_infinite] rounded-full ${outlineClass} opacity-75`}
            />
            <div
              className={`relative inline-flex h-full w-full rounded-full border-2 border-white ${highlightClass}`}
            />
          </div>
        ),
        size: Leaflet.point(20, 20),
        anchor: Leaflet.point(10, 10),
        className: "!z-[2000]",
      })}
    />
  );
}
