import { useCallback } from "react";
import Leaflet from "leaflet";

export default function useLocate(map: Leaflet.Map) {
  const locate = useCallback(
    (options?: Leaflet.LocateOptions) => {
      if (map) {
        return new Promise<Leaflet.LatLng>((resolve, reject) => {
          const onLocationFound = (event: Leaflet.LocationEvent) => {
            map.off("locationfound", onLocationFound);
            map.off("locationerror", onLocationError);
            resolve(event.latlng);
          };

          const onLocationError = () => {
            map.off("locationfound", onLocationFound);
            map.off("locationerror", onLocationError);
            reject();
          };

          map.once("locationfound", onLocationFound);
          map.once("locationerror", onLocationError);

          map.locate({ maximumAge: 60000, ...options });
        });
      }

      return Promise.reject();
    },
    [map],
  );

  return locate;
}
