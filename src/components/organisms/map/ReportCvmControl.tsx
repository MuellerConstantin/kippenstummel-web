import { useCallback, useEffect, useState, memo } from "react";
import ReactDOM from "react-dom/client";
import { useMap } from "react-leaflet";
import Leaflet from "leaflet";
import { MapPinPlus, LoaderCircle } from "lucide-react";
import useLocate from "@/hooks/useLocate";

interface ReportCvmControlComponentProps {
  map: Leaflet.Map;
  onReport?: (position: Leaflet.LatLng) => void;
}

export function ReportCvmControlComponent(
  props: ReportCvmControlComponentProps,
) {
  const { map, onReport } = props;
  const locate = useLocate(map);

  const [reporting, setReporting] = useState(false);

  const onClick = useCallback(() => {
    setReporting(true);

    locate({ setView: true, maxZoom: 15 })
      .then((position) => onReport?.(position))
      .finally(() => {
        setReporting(false);
      });
  }, [locate, onReport]);

  return (
    <a
      className="leaflet-bar-part leaflet-bar-part-single !h-[45px] !w-[45px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex h-full w-full items-center justify-center">
        {reporting ? (
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

export const ReportCvmControlPlugin = memo(function ReportCvmControlPlugin(
  props: ReportCvmControlPluginProps,
) {
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
});
