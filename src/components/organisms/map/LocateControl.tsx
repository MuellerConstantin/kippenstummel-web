import useLocate from "@/hooks/useLocate";
import {
  LocateFixed as LocateFixedIcon,
  LoaderCircle as LoaderCircleIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useControl, useMap } from "react-map-gl/maplibre";

export function LocateControlComponent() {
  const { current: map } = useMap();
  const locate = useLocate();

  const [locating, setLocating] = useState(false);

  const onClick = useCallback(() => {
    setLocating(true);

    locate()
      .then((position) =>
        map?.flyTo({
          center: [position.longitude, position.latitude],
          zoom: 15,
        }),
      )
      .finally(() => {
        setLocating(false);
      });
  }, [locate, map]);

  return (
    <button
      onClick={onClick}
      type="button"
      className="maplibregl-ctrl-geolocate flex! items-center! justify-center!"
    >
      {locating ? (
        <LoaderCircleIcon className="h-5 w-5 animate-spin" />
      ) : (
        <LocateFixedIcon className="h-5 w-5" />
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
