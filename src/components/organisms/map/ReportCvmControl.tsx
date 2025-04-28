import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useMap } from "react-leaflet";
import Leaflet from "leaflet";
import { MapPinPlus, LoaderCircle } from "lucide-react";

interface ReportCvmControlComponentProps {
  map: Leaflet.Map;
  onReport?: (position: Leaflet.LatLng) => void;
}

export function ReportCvmControlComponent(
  props: ReportCvmControlComponentProps,
) {
  const [reporting, setReporting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locatedPosition, setLocatedPosition] = useState<Leaflet.LatLng | null>(
    null,
  );

  useEffect(() => {
    if (props.map) {
      props.map.on("locationfound", (event) => {
        setLocating(false);
        setLocatedPosition(event.latlng);
      });

      props.map.on("locationerror", (event) => {
        setLocating(false);
        console.error(`Location error: ${event.message}`, event);
      });
    }
  }, [props.map]);

  const onClick = useCallback(() => {
    setLocating(true);
    setReporting(true);
    props.map.locate();
  }, [props.map]);

  useEffect(() => {
    if (reporting && !locating && locatedPosition) {
      setReporting(false);
      setLocatedPosition(null);
      props.onReport?.(locatedPosition);
    }
  }, [locatedPosition, reporting, locating, props.onReport, props]);

  return (
    <a
      className="leaflet-bar-part leaflet-bar-part-single !h-[45px] !w-[45px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex h-full w-full items-center justify-center">
        {locating ? (
          <LoaderCircle className="h-7 w-7 animate-spin" />
        ) : (
          <MapPinPlus className="h-7 w-7" />
        )}
      </div>
    </a>
  );
}

interface ReportCvmControlProps extends Leaflet.ControlOptions {
  onReport?: (position: Leaflet.LatLng) => void;
}

export class ReportCvmControl extends Leaflet.Control {
  private _options: ReportCvmControlProps;
  private _container?: HTMLElement;
  private _root?: ReactDOM.Root;

  constructor(options: ReportCvmControlProps) {
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
      <ReportCvmControlComponent map={map} onReport={this._options.onReport} />,
    );

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

interface ReportCvmControlPluginProps extends Leaflet.ControlOptions {
  onReport?: (position: Leaflet.LatLng) => void;
}

export function ReportCvmControlPlugin(props: ReportCvmControlPluginProps) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const control = new ReportCvmControl(props);
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map, props]);

  return null;
}
