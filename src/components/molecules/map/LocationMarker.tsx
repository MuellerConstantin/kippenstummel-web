import Leaflet from "leaflet";
import { Marker, Popup } from "react-leaflet";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { MapPin, ChevronUp, ChevronDown, Copy } from "lucide-react";
import { Link } from "@/components/atoms/Link";

interface ClusterMarkerProps {
  position: [number, number];
  score: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
}

export function LocationMarker(props: ClusterMarkerProps) {
  return (
    <Marker
      position={Leaflet.latLng(props.position[0], props.position[1])}
      icon={LeafletDivIcon({
        source: (
          <div className="z-[50] h-fit w-fit">
            <MapPin className="h-8 w-8 fill-green-600 text-white" />
          </div>
        ),
        anchor: Leaflet.point(20, 20),
      })}
    >
      <Popup>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <button
              className="cursor-pointer text-slate-600 hover:text-slate-800"
              onClick={props.onUpvote}
            >
              <ChevronUp className="h-8 w-8" />
            </button>
            <div className="text-lg font-semibold">{props.score}</div>
            <button
              className="cursor-pointer text-slate-600 hover:text-slate-800"
              onClick={props.onDownvote}
            >
              <ChevronDown className="h-8 w-8" />
            </button>
          </div>
          <div className="space-y-1">
            <div className="text-base font-semibold">
              Cigarette Vending Machine
            </div>
            <div className="text-sm font-semibold">Location</div>
            <div className="flex items-center gap-2">
              <div className="text-xs">
                {props.position[0].toFixed(7)} / {props.position[1].toFixed(7)}{" "}
                (lat/lng)
              </div>
              <button
                className="cursor-pointer text-slate-600 hover:text-slate-800"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${props.position[0]},${props.position[1]}`,
                  )
                }
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <Link
              href={`https://www.google.com.sa/maps/search/${props.position[0]},${props.position[1]}`}
              target="_blank"
            >
              Open in Google Maps
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
