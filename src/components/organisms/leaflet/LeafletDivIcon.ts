import Leaflet, { PointExpression } from "leaflet";
import { ReactNode } from "react";
import { renderToString } from "react-dom/server";

interface divIconValues {
  source: ReactNode;
  anchor: PointExpression;
}

const LeafletDivIcon = ({ source, anchor }: divIconValues) =>
  Leaflet?.divIcon({
    html: renderToString(source),
    iconAnchor: anchor,
    className: "hidden",
  });

export default LeafletDivIcon;
