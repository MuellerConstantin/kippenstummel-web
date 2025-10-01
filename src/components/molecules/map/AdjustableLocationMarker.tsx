import { useEffect, useMemo, useRef, useState } from "react";
import Leaflet from "leaflet";
import { Circle, Marker, Tooltip } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { MapPinPlusInside } from "lucide-react";
import { useTranslations } from "next-intl";
import { GeoCoordinates } from "@/lib/types/geo";

interface AdjustableLocationMarkerProps {
  onAdapt?: (position: GeoCoordinates) => void;
  position: GeoCoordinates;
  reference?: {
    position: GeoCoordinates;
    maxDistance: number;
  };
}

export function AdjustableLocationMarker(props: AdjustableLocationMarkerProps) {
  const { reference, onAdapt } = props;
  const t = useTranslations("AdjustableLocationMarker");

  const markerRef = useRef<Leaflet.Marker>(null);

  const [position, setPosition] = useState<GeoCoordinates>(props.position);
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const eventHandlers = useMemo(
    () => ({
      drag() {
        const marker = markerRef.current;
        if (marker && reference) {
          const newPosition = marker.getLatLng();

          const distance = Leaflet.latLng(
            reference.position.latitude,
            reference.position.longitude,
          ).distanceTo(newPosition);

          if (distance > reference.maxDistance) {
            marker.setLatLng(newPosition);
          }
        }
      },
      dragend() {
        const marker = markerRef.current;
        if (marker && reference) {
          const newPosition = marker.getLatLng();

          if (reference) {
            const distance = Leaflet.latLng(
              reference.position.latitude,
              reference.position.longitude,
            ).distanceTo(newPosition);

            if (distance <= reference.maxDistance) {
              setPosition({
                latitude: newPosition.lat,
                longitude: newPosition.lng,
              });
            } else {
              marker.setLatLng(
                Leaflet.latLng(position.latitude, position.longitude),
              );
            }
          } else {
            setPosition({
              latitude: newPosition.lat,
              longitude: newPosition.lng,
            });
          }
        }
      },
      mousedown() {
        setTooltipOpen(false);
      },
    }),
    [reference, position],
  );

  useEffect(() => {
    if (onAdapt) {
      onAdapt(position);
    }
  }, [position, onAdapt]);

  return (
    <>
      <Marker
        eventHandlers={eventHandlers}
        draggable={true}
        ref={markerRef}
        position={Leaflet.latLng(position.latitude, position.longitude)}
        icon={LeafletDivIcon({
          source: (
            <div className="relative h-fit w-fit">
              <MapPinPlusInside className="h-[36px] w-[36px] fill-green-600 text-white dark:text-slate-600" />
            </div>
          ),
          size: Leaflet.point(36, 36),
          anchor: Leaflet.point(18, 26),
          className: "!z-[3000]",
        })}
      >
        {tooltipOpen && (
          <Tooltip permanent offset={[0, -26]} direction="top">
            {t("tooltip")}
          </Tooltip>
        )}
      </Marker>
      {reference && (
        <Circle
          radius={reference.maxDistance}
          center={Leaflet.latLng(
            reference.position.latitude,
            reference.position.longitude,
          )}
          pathOptions={{ color: "#16a34a", fillColor: "#16a34a" }}
        />
      )}
    </>
  );
}
