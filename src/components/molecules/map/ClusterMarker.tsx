import { useMemo, useCallback } from "react";
import Leaflet from "leaflet";
import { Marker, useMap } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";

function formatNumberShort(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return (n / 1000).toFixed(n < 10_000 ? 1 : 0) + "K";
  if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n < 1_000_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";

  return (n / 1_000_000_000).toFixed(1) + "B";
}

interface ClusterMarkerProps {
  count: number;
  position: [number, number];
}

export function ClusterMarker(props: ClusterMarkerProps) {
  const map = useMap();

  const outerClasses = useMemo(() => {
    let outerClasses = "";

    if (props.count < 10) {
      outerClasses = "bg-green-300 opacity-80";
    } else if (props.count < 100) {
      outerClasses = "bg-amber-300 opacity-80";
    } else {
      outerClasses = "bg-orange-300 opacity-80";
    }

    return outerClasses;
  }, [props.count]);

  const innerClasses = useMemo(() => {
    let innerClasses = "";

    if (props.count < 10) {
      innerClasses = "bg-green-400";
    } else if (props.count < 100) {
      innerClasses = "bg-amber-400";
    } else {
      innerClasses = "bg-orange-400";
    }

    return innerClasses;
  }, [props.count]);

  const handleClick = useCallback(() => {
    const bounds = Leaflet.latLngBounds([props.position]);

    map.flyTo(Leaflet.latLng(props.position), map.getBoundsZoom(bounds));
  }, [map]);

  return (
    <Marker
      position={Leaflet.latLng(props.position[0], props.position[1])}
      icon={LeafletDivIcon({
        source: (
          <div
            className={`${outerClasses} box-border h-fit w-fit rounded-[20px] p-[5px]`}
          >
            <div
              className={`${innerClasses} h-[30px] w-[30px] rounded-full text-center font-sans text-[12px] leading-[30px]`}
            >
              <span>{formatNumberShort(props.count)}</span>
            </div>
          </div>
        ),
        anchor: Leaflet.point(30, 30),
      })}
      eventHandlers={{ click: handleClick }}
    />
  );
}
