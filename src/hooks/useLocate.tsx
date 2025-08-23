import { useCallback } from "react";
import Leaflet from "leaflet";
import { useAppDispatch, useAppSelector } from "@/store";
import locationSlice from "@/store/slices/location";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";

const LOCATION_TTL = 60 * 1000;
const LOCATION_COOLDOWN = 10 * 1000;

export default function useLocate(map: Leaflet.Map) {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { enqueue } = useNotifications();

  const lastLocation = useAppSelector((state) => state.location.location);
  const lastLocatedAt = useAppSelector((state) => state.location.locatedAt);

  const locate = useCallback(
    (options?: Leaflet.LocateOptions) => {
      if (map) {
        return new Promise<Leaflet.LatLng>((resolve, reject) => {
          const onLocationFound = (event: Leaflet.LocationEvent) => {
            map.off("locationfound", onLocationFound);
            map.off("locationerror", onLocationError);

            dispatch(
              locationSlice.actions.setLocation({
                lat: event.latlng.lat,
                lng: event.latlng.lng,
              }),
            );

            resolve(event.latlng);
          };

          const onLocationError = (event: Leaflet.ErrorEvent) => {
            map.off("locationfound", onLocationFound);
            map.off("locationerror", onLocationError);

            // Use cached location if still valid
            if (
              lastLocation &&
              lastLocatedAt &&
              Date.now() - new Date(lastLocatedAt).getTime() < LOCATION_TTL
            ) {
              return resolve(
                Leaflet.latLng(lastLocation.lat, lastLocation.lng),
              );
            }

            let title = "";
            let description = "";

            const PERMISSION_DENIED = 1;
            const POSITION_UNAVAILABLE = 2;
            const TIMEOUT = 3;

            switch (event.code) {
              case PERMISSION_DENIED:
                title = t(
                  "Notifications.locationDeterminationFailed.permissionDenied.title",
                );
                description = t(
                  "Notifications.locationDeterminationFailed.permissionDenied.description",
                );
                break;
              case POSITION_UNAVAILABLE:
                title = t(
                  "Notifications.locationDeterminationFailed.unavailable.title",
                );
                description = t(
                  "Notifications.locationDeterminationFailed.unavailable.description",
                );
                break;
              case TIMEOUT:
                title = t(
                  "Notifications.locationDeterminationFailed.timeout.title",
                );
                description = t(
                  "Notifications.locationDeterminationFailed.timeout.description",
                );
                break;
              default:
                title = t(
                  "Notifications.locationDeterminationFailed.default.title",
                );
                description = t(
                  "Notifications.locationDeterminationFailed.default.description",
                );
                break;
            }

            enqueue(
              {
                title,
                description,
                variant: "error",
              },
              { timeout: 10000 },
            );

            dispatch(locationSlice.actions.clearLocation());
            reject();
          };

          // Trigger relocate only if cooldown period has passed, otherwise use cached location
          if (
            lastLocation &&
            lastLocatedAt &&
            Date.now() - new Date(lastLocatedAt).getTime() < LOCATION_COOLDOWN
          ) {
            return resolve(Leaflet.latLng(lastLocation.lat, lastLocation.lng));
          }

          map.once("locationfound", onLocationFound);
          map.once("locationerror", onLocationError);

          map.locate({ ...options, maximumAge: 0 });
        });
      }

      return Promise.reject();
    },
    [map, dispatch, enqueue, t, lastLocation, lastLocatedAt],
  );

  return locate;
}
