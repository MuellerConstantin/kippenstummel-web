import { useMemo, useCallback } from "react";
import Leaflet from "leaflet";
import { Marker, useMap } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";

interface ClusterMarkerProps {
  count: number;
  position: Leaflet.LatLng;
}

export function ClusterMarker(props: ClusterMarkerProps) {
  const map = useMap();

  const outerClasses = useMemo(() => {
    let outerClasses = "";

    if (props.count < 10) {
      outerClasses = "bg-green-500 opacity-80";
    } else if (props.count < 100) {
      outerClasses = "bg-amber-500 opacity-80";
    } else {
      outerClasses = "bg-orange-500 opacity-80";
    }

    return outerClasses;
  }, [props.count]);

  const formattedCount = useMemo(() => {
    if (props.count < 1000) return props.count.toString();
    if (props.count < 1_000_000)
      return (props.count / 1000).toFixed(props.count < 10_000 ? 1 : 0) + "K";
    if (props.count < 1_000_000_000)
      return (props.count / 1_000_000).toFixed(1) + "M";
    if (props.count < 1_000_000_000_000)
      return (props.count / 1_000_000_000).toFixed(1) + "B";

    return (props.count / 1_000_000_000).toFixed(1) + "B";
  }, [props.count]);

  const handleClick = useCallback(() => {
    const newZoom = Math.min(map.getZoom() + 1, map.getMaxZoom());

    map.flyTo(Leaflet.latLng(props.position), newZoom);
  }, [map, props.position]);

  return (
    <Marker
      position={Leaflet.latLng(props.position)}
      icon={LeafletDivIcon({
        source: (
          <div
            className={`${outerClasses} box-border h-fit w-fit rounded-[20px] p-[3px]`}
          >
            <div className="h-[32px] w-[32px] rounded-full bg-slate-300 text-center font-sans text-[12px] leading-[30px] text-slate-800 dark:bg-slate-600 dark:text-slate-100">
              <span>{formattedCount}</span>
            </div>
          </div>
        ),
        size: Leaflet.point(32, 32),
        anchor: Leaflet.point(16, 16),
      })}
      eventHandlers={{ click: handleClick }}
    />
  );
}
