import { useEffect, memo } from "react";
import ReactDOM from "react-dom/client";
import { useMap } from "react-leaflet";
import Leaflet from "leaflet";
import { CircleHelp } from "lucide-react";

interface HelpControlComponentProps {
  map: Leaflet.Map;
  onClick?: () => void;
}

export function HelpControlComponent(props: HelpControlComponentProps) {
  const { onClick } = props;

  return (
    <a
      className="leaflet-bar-part leaflet-bar-part-single cursor-pointer"
      onClick={() => onClick?.()}
    >
      <div className="flex h-full w-full items-center justify-center">
        <CircleHelp className="h-5 w-5" />
      </div>
    </a>
  );
}

interface HelpControlProps extends Leaflet.ControlOptions {
  onClick?: () => void;
}

export class HelpControl extends Leaflet.Control {
  private _options: HelpControlProps;
  private _container?: HTMLElement;
  private _root?: ReactDOM.Root;

  constructor(options: HelpControlProps) {
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
      <HelpControlComponent map={map} onClick={this._options.onClick} />,
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

interface HelpControlPluginProps extends Leaflet.ControlOptions {
  onClick?: () => void;
}

export const HelpControlPlugin = memo(function HelpControlPlugin(
  props: HelpControlPluginProps,
) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const control = new HelpControl(props);
      map.addControl(control);

      return () => {
        map.removeControl(control);
      };
    }
  }, [map, props]);

  return null;
});
