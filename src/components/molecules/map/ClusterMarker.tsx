import { useMemo } from "react";
import Leaflet from "leaflet";
import { Marker } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";

interface ClusterMarkerProps {
  count: number;
  position: [number, number];
}

export function ClusterMarker(props: ClusterMarkerProps) {
  const outerClasses = useMemo(() => {
    let outerClasses = "";

    if (props.count < 10) {
      outerClasses = "bg-[rgba(181,226,140,0.6)]";
    } else if (props.count < 100) {
      outerClasses = "bg-[rgba(241,211,87,0.6)]";
    } else {
      outerClasses = "bg-[rgba(253,156,115,0.6)]";
    }

    return outerClasses;
  }, [props.count]);

  const innerClasses = useMemo(() => {
    let innerClasses = "";

    if (props.count < 10) {
      innerClasses = "bg-[rgba(110,204,57,0.6)]";
    } else if (props.count < 100) {
      innerClasses = "bg-[rgba(240,194,12,0.6)]";
    } else {
      innerClasses = "bg-[rgba(241,128,23,0.6)]";
    }

    return innerClasses;
  }, [props.count]);

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
              <span>{props.count}</span>
            </div>
          </div>
        ),
        anchor: Leaflet.point(20, 20),
      })}
    />
  );
}
