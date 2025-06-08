import Leaflet, { PointExpression } from "leaflet";
import { ReactNode } from "react";
import { renderToString } from "react-dom/server";

interface divIconValues {
  source: ReactNode;
  anchor?: PointExpression;
  size?: PointExpression;
  className?: string;
}

const LeafletDivIcon = ({ source, anchor, className, size }: divIconValues) =>
  Leaflet?.divIcon({
    html: renderToString(source),
    iconAnchor: anchor,
    className: `hidden ${className}`,
    iconSize: size,
  });

export default LeafletDivIcon;
