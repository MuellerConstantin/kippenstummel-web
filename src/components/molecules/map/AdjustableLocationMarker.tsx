"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Marker,
  Popup,
  Source,
  Layer,
  MarkerDragEvent,
} from "react-map-gl/maplibre";
import { MapPinPlusInside, Move } from "lucide-react";
import { useTranslations } from "next-intl";
import * as turf from "@turf/turf";
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

  const [position, setPosition] = useState<GeoCoordinates>(props.position);
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const circleGeoJSON = useMemo(() => {
    if (!reference) return null;
    const center = [reference.position.longitude, reference.position.latitude];
    const circle = turf.circle(center, reference.maxDistance / 1000, {
      steps: 64,
      units: "kilometers",
    });
    return circle;
  }, [reference]);

  const handleDragEnd = (event: MarkerDragEvent) => {
    const lngLat = event.lngLat;

    if (reference) {
      const distance = turf.distance(
        [reference.position.longitude, reference.position.latitude],
        [lngLat.lng, lngLat.lat],
        { units: "meters" },
      );

      if (distance <= reference.maxDistance) {
        setPosition({ latitude: lngLat.lat, longitude: lngLat.lng });
      } else {
        setPosition((prev) => ({ ...prev }));
      }
    } else {
      setPosition({ latitude: lngLat.lat, longitude: lngLat.lng });
    }

    setTooltipOpen(false);
  };

  useEffect(() => {
    if (onAdapt) {
      onAdapt(position);
    }
  }, [position, onAdapt]);

  return (
    <>
      <Marker
        longitude={position.longitude}
        latitude={position.latitude}
        draggable
        onDragStart={() => setTooltipOpen(false)}
        onDragEnd={handleDragEnd}
        anchor="bottom"
      >
        <div
          className="relative h-fit w-fit cursor-pointer"
          onMouseDown={() => setTooltipOpen(false)}
        >
          <MapPinPlusInside className="h-[32px] w-[32px] fill-green-600 text-white dark:text-slate-600" />
        </div>
      </Marker>
      {tooltipOpen && (
        <Popup
          longitude={position.longitude}
          latitude={position.latitude}
          closeButton={false}
          offset={[-12, -32]}
          anchor="bottom-right"
        >
          <div className="flex items-center justify-center gap-2">
            <Move className="h-4 w-4 text-green-600" />
            <span className="font-semibold">{t("tooltip")}</span>
          </div>
        </Popup>
      )}
      {circleGeoJSON && (
        <Source id="reference-circle" type="geojson" data={circleGeoJSON}>
          <Layer
            id="circle-fill"
            type="fill"
            paint={{
              "fill-color": "#16a34a",
              "fill-opacity": 0.2,
            }}
          />
          <Layer
            id="circle-outline"
            type="line"
            paint={{
              "line-color": "#16a34a",
              "line-width": 2,
            }}
          />
        </Source>
      )}
    </>
  );
}
