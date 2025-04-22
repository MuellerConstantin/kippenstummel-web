import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useMap } from "react-leaflet";
import Leaflet from "leaflet";
import { LocateFixed, LoaderCircle } from "lucide-react";

interface LocateControlComponentProps {
  map: Leaflet.Map;
}

export function LocateControlComponent(props: LocateControlComponentProps) {
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (props.map) {
      props.map.on("locationfound", (event) => {
        setLocating(false);
      });

      props.map.on("locationerror", (event) => {
        setLocating(false);
        console.error(`Location error: ${event.message}`, event);
      });
    }
  }, [props.map]);

  const onClick = useCallback(() => {
    setLocating(true);
    props.map.locate();
  }, [props.map]);

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

  onRemove(map: Leaflet.Map): void {
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

interface LocateControlPluginProps extends Leaflet.ControlOptions {}

export function LocateControlPlugin(props: LocateControlPluginProps) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const control = new LocateControl(props);
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map]);

  return null;
}
