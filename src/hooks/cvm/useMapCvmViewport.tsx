import { GeoCoordinates } from "@/lib/types/geo";
import { useCallback, useState } from "react";
import { Map, MapLibreEvent } from "maplibre-gl";
import { ViewStateChangeEvent } from "react-map-gl/maplibre";

export function useCvmMapViewport() {
  const [map, setMap] = useState<Map | null>(null);
  const [zoom, setZoom] = useState<number>();
  const [bottomLeft, setBottomLeft] = useState<GeoCoordinates>();
  const [topRight, setTopRight] = useState<GeoCoordinates>();

  const updateFromMap = (map: Map) => {
    const bounds = map.getBounds();
    setZoom(Math.ceil(map.getZoom()));
    setBottomLeft({
      latitude: bounds.getSouthWest().lat,
      longitude: bounds.getSouthWest().lng,
    });
    setTopRight({
      latitude: bounds.getNorthEast().lat,
      longitude: bounds.getNorthEast().lng,
    });
  };

  const onLoad = useCallback((e: MapLibreEvent) => {
    setMap(e.target);
    updateFromMap(e.target);
  }, []);

  const onViewStateChanged = useCallback((e: ViewStateChangeEvent) => {
    updateFromMap(e.target);
  }, []);

  return {
    map,
    zoom,
    bottomLeft,
    topRight,
    onLoad,
    onViewStateChanged,
    flyTo: map?.flyTo.bind(map),
  };
}
