import { useCallback, useEffect, useState, memo } from "react";
import ReactDOM from "react-dom/client";
import { useMap } from "react-leaflet";
import Leaflet from "leaflet";
import { LocateFixed, LoaderCircle } from "lucide-react";
import useLocate from "@/hooks/useLocate";

interface LocateControlComponentProps {
  map: Leaflet.Map;
}

export function LocateControlComponent(props: LocateControlComponentProps) {
  const { map } = props;
  const locate = useLocate(map);

  const [locating, setLocating] = useState(false);

  const onClick = useCallback(() => {
    setLocating(true);

    locate({ setView: true, maxZoom: 15 }).finally(() => {
      setLocating(false);
    });
  }, [locate]);

  return (
    <a
      className="leaflet-bar-part leaflet-bar-part-single cursor-pointer"
      onClick={onClick}
    >
      <div className="flex h-full w-full items-center justify-center">
        {locating ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          <LocateFixed className="h-5 w-5" />
        )}
      </div>
    </a>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LocateControlProps extends Leaflet.ControlOptions {}

export class LocateControl extends Leaflet.Control {
  private _container?: HTMLElement;
  private _root?: ReactDOM.Root;

  constructor(options: LocateControlProps) {
    super(options);
  }

  onAdd(map: Leaflet.Map): HTMLElement {
    this._container = Leaflet.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control",
    );
    Leaflet.DomEvent.disableClickPropagation(this._container);

    this._root = ReactDOM.createRoot(this._container);
    this._root.render(<LocateControlComponent map={map} />);

    return this._container;
  }

  onRemove(): void {
    if (this._root) {
      setTimeout(() => {
        this._root?.unmount();
      }, 0);
    }

    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LocateControlPluginProps extends Leaflet.ControlOptions {}

export const LocateControlPlugin = memo(function LocateControlPlugin(
  props: LocateControlPluginProps,
) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const control = new LocateControl(props);
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map, props]);

  return null;
});
