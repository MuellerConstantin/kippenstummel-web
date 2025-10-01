import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import Leaflet from "leaflet";
import { Navigation, LoaderCircle } from "lucide-react";
import useLocate from "@/hooks/useLocate";

interface LocateControlComponentProps {
  map: Leaflet.Map;
}

export function LocateControlComponent(props: LocateControlComponentProps) {
  const { map } = props;
  const locate = useLocate();

  const [locating, setLocating] = useState(false);

  const onClick = useCallback(() => {
    setLocating(true);

    locate()
      .then((position) =>
        map.flyTo(Leaflet.latLng(position.latitude, position.longitude), 15),
      )
      .finally(() => {
        setLocating(false);
      });
  }, [locate, map]);

  return (
    <a
      className="leaflet-bar-part leaflet-bar-part-single cursor-pointer"
      onClick={onClick}
    >
      <div className="flex h-full w-full items-center justify-center">
        {locating ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          <Navigation className="h-5 w-5" />
        )}
      </div>
    </a>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LocateControlPluginProps extends Leaflet.ControlOptions {}

export function LocateControlPlugin(props: LocateControlPluginProps) {
  const map = useMap();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map) return;

    const control = new Leaflet.Control(props);
    const div = Leaflet.DomUtil.create("div", "leaflet-bar leaflet-control");
    Leaflet.DomEvent.disableClickPropagation(div);

    control.onAdd = () => div;
    map.addControl(control);

    setContainer(div);

    return () => {
      map.removeControl(control);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ...Object.values(props)]);

  return container
    ? createPortal(<LocateControlComponent map={map!} />, container)
    : null;
}
