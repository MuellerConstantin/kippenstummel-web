import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useMap } from "react-leaflet";
import Leaflet from "leaflet";
import { LocateFixed, LoaderCircle } from "lucide-react";
import { LocateMarker } from "@/components/molecules/map/LocateMarker";

interface LocateControlComponentProps {
  map: Leaflet.Map;
  onLocated?: (position: Leaflet.LatLng) => void;
}

export function LocateControlComponent(props: LocateControlComponentProps) {
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (props.map) {
      props.map.on("locationfound", (e) => {
        setLocating(false);
        props.onLocated?.(e.latlng);
      });

      props.map.on("locationerror", (e) => {
        setLocating(false);
        console.error(`Location error: ${e.message}`, e);
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

interface LocateControlProps extends Leaflet.ControlOptions {
  onLocated?: (position: Leaflet.LatLng) => void;
}

export class LocateControl extends Leaflet.Control {
  private _options: LocateControlProps;
  private _container?: HTMLElement;
  private _root?: ReactDOM.Root;

  constructor(options: LocateControlProps) {
    super(options);
    this._options = options;
  }

  onAdd(map: Leaflet.Map): HTMLElement {
    this._container = Leaflet.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control",
    );
    Leaflet.DomEvent.disableClickPropagation(this._container);

    this._root = ReactDOM.createRoot(this._container);
    this._root.render(
      <LocateControlComponent map={map} onLocated={this._options.onLocated} />,
    );

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

  const [locatedPosition, setLocatedPosition] = useState<
    Leaflet.LatLng | undefined
  >(undefined);

  const onLocated = useCallback((position: Leaflet.LatLng) => {
    setLocatedPosition(position);
  }, []);

  useEffect(() => {
    if (map) {
      const control = new LocateControl({ ...props, onLocated });
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map]);

  useEffect(() => {
    if (locatedPosition) {
      map?.flyTo(locatedPosition);
    }
  }, [map, locatedPosition]);

  if (locatedPosition) {
    return (
      <LocateMarker position={[locatedPosition.lat, locatedPosition.lng]} />
    );
  }

  return null;
}
