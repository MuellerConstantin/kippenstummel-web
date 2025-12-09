import useLocate from "@/hooks/useLocate";
import useLocateWatcher from "@/hooks/useLocateWatcher";
import { useAppSelector } from "@/store";
import {
  Navigation as NavigationIcon,
  LoaderCircle as LoaderCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useControl, useMap } from "react-map-gl/maplibre";

export function LocateControlComponent() {
  const t = useTranslations();
  const { current: map } = useMap();
  const locate = useLocate();
  const { startWatching, stopWatching, isWatching } = useLocateWatcher();

  const [locating, setLocating] = useState(false);

  const autoLocateDoneRef = useRef(false);
  const autoLocation = useAppSelector((state) => state.usability.autoLocation);
  const location = useAppSelector((state) => state.location.location);

  useEffect(() => {
    if (!map) return;
    if (!autoLocation) return;
    if (autoLocateDoneRef.current) return;
    if (!location) return;

    autoLocateDoneRef.current = true;

    map?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 15,
    });
  }, [map, autoLocation, location]);

  const onClick = useCallback(() => {
    if (isWatching) {
      stopWatching();
      return;
    }

    if (locating) {
      return;
    }

    setLocating(true);

    locate()
      .then((position) =>
        map?.flyTo({
          center: [position.longitude, position.latitude],
          zoom: 15,
        }),
      )
      .then(() => startWatching())
      .finally(() => {
        setLocating(false);
      });
  }, [locate, map, locating, startWatching, isWatching, stopWatching]);

  return (
    <button
      title={t("MapLibreControls.GeolocateControl.FindMyLocation")}
      onClick={onClick}
      disabled={locating}
      type="button"
      className="maplibregl-ctrl-geolocate flex! items-center! justify-center!"
    >
      {locating ? (
        <LoaderCircleIcon className="h-5 w-5 animate-spin" />
      ) : (
        <NavigationIcon
          className={`h-5 w-5 ${isWatching ? "text-green-600" : ""}`}
        />
      )}
    </button>
  );
}

interface LocateControlProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function LocateControl({ position = "top-right" }: LocateControlProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useControl(
    () => {
      class LocateControlWrapper {
        private _container: HTMLDivElement | null = null;

        onAdd() {
          this._container = document.createElement("div");
          this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";

          setContainer(this._container);
          return this._container;
        }

        onRemove() {
          this._container?.parentNode?.removeChild(this._container);
        }
      }

      return new LocateControlWrapper();
    },
    { position },
  );

  return container ? createPortal(<LocateControlComponent />, container) : null;
}
