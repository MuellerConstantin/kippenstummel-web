import { useCvmMapFollow } from "@/contexts/CvmMapFollowProvider";
import {
  Locate as LocateIcon,
  LocateFixed as LocateFixedIcon,
  LoaderCircle as LoaderCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useControl } from "react-map-gl/maplibre";

export function LocateControlComponent() {
  const t = useTranslations();

  const {
    isWatching,
    isFollowing,
    locating,
    startTrackingAndFollow,
    stopTracking,
    resumeFollowing,
  } = useCvmMapFollow();

  const onClick = useCallback(() => {
    if (!isWatching) {
      startTrackingAndFollow();
      return;
    }

    if (isWatching && !isFollowing) {
      resumeFollowing();
      return;
    }

    stopTracking();
  }, [
    isWatching,
    isFollowing,
    startTrackingAndFollow,
    resumeFollowing,
    stopTracking,
  ]);

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
      ) : !isWatching ? (
        // No tracking/watching
        <LocateIcon className="h-5 w-5" />
      ) : isFollowing ? (
        // Tracking/Watching + follow
        <LocateFixedIcon className="h-5 w-5 text-green-600" />
      ) : (
        // Tracking/Watching without follow
        <LocateIcon className="h-5 w-5 text-green-600 opacity-80" />
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
