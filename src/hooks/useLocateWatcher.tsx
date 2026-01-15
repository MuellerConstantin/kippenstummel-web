import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import locationSlice from "@/store/slices/location";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";

export default function useLocateWatcher() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { enqueue } = useNotifications();

  const watchIdRef = useRef<number | null>(null);

  const isWatching = useAppSelector((state) => !!state.location.isWatching);
  const autoLocation = useAppSelector((state) => state.usability.autoLocation);

  const startWatching = useCallback(
    (options?: PositionOptions) => {
      if (watchIdRef.current !== null) {
        return;
      }

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          dispatch(locationSlice.actions.setLocation(location));
        },
        (err) => {
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

          enqueue({ title, description, variant: "error" }, { timeout: 10000 });
          dispatch(locationSlice.actions.clearLocation());
          throw err;
        },
        { enableHighAccuracy: true, maximumAge: 0, ...options },
      );

      watchIdRef.current = id;
      dispatch(locationSlice.actions.setIsWatching(true));
    },
    [dispatch, enqueue, t],
  );

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      dispatch(locationSlice.actions.setIsWatching(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (autoLocation) {
      startWatching();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { startWatching, stopWatching, isWatching };
}
