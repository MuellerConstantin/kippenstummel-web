import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import locationSlice from "@/store/slices/location";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { LOCATION_TTL, LOCATION_COOLDOWN } from "@/lib/constants";
import { GeoCoordinates } from "@/lib/types/geo";

export default function useLocate() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { enqueue } = useNotifications();

  const lastLocation = useAppSelector((state) => state.location.location);
  const lastLocatedAt = useAppSelector((state) => state.location.locatedAt);

  const locate = useCallback(
    (options?: PositionOptions) => {
      return new Promise<GeoCoordinates>((resolve, reject) => {
        if (
          lastLocation &&
          lastLocatedAt &&
          Date.now() - new Date(lastLocatedAt).getTime() < LOCATION_COOLDOWN
        ) {
          return resolve(lastLocation);
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const location = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            };

            dispatch(locationSlice.actions.setLocation(location));
            resolve(location);
          },
          (err) => {
            if (
              lastLocation &&
              lastLocatedAt &&
              Date.now() - new Date(lastLocatedAt).getTime() < LOCATION_TTL
            ) {
              return resolve(lastLocation);
            }

            let title = "";
            let description = "";

            switch (err.code) {
              case err.PERMISSION_DENIED:
                title = t(
                  "Notifications.locationDeterminationFailed.permissionDenied.title",
                );
                description = t(
                  "Notifications.locationDeterminationFailed.permissionDenied.description",
                );
                break;
              case err.POSITION_UNAVAILABLE:
                title = t(
                  "Notifications.locationDeterminationFailed.unavailable.title",
                );
                description = t(
                  "Notifications.locationDeterminationFailed.unavailable.description",
                );
                break;
              case err.TIMEOUT:
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
              { title, description, variant: "error" },
              { timeout: 10000 },
            );
            dispatch(locationSlice.actions.clearLocation());
            reject(err);
          },
          { enableHighAccuracy: true, maximumAge: 0, ...options },
        );
      });
    },
    [dispatch, enqueue, t, lastLocation, lastLocatedAt],
  );

  return locate;
}
