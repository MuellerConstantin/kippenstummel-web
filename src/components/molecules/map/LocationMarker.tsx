import { useCallback, useState } from "react";
import Leaflet from "leaflet";
import { Marker, Popup, useMap } from "react-leaflet";
import { useTranslations } from "next-intl";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import { MapPin, ChevronUp, ChevronDown, Copy } from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { Spinner } from "@/components/atoms/Spinner";
import useLocate from "@/hooks/useLocate";

interface LocationMarkerPopupProps {
  position: [number, number];
  score: number;
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
}

function LocationMarkerPopup(props: LocationMarkerPopupProps) {
  const t = useTranslations("LocationMarker");
  const map = useMap();
  const locate = useLocate(map);
  const { onUpvote, onDownvote } = props;

  const [voting, setVoting] = useState<"up" | "down" | false>(false);

  const onUpvoteRequest = useCallback(() => {
    setVoting("up");

    locate({ setView: false, maxZoom: 15 })
      .then((position) => onUpvote?.(position))
      .finally(() => {
        setVoting(false);
      });
  }, [locate, onUpvote]);

  const onDownvoteRequest = useCallback(() => {
    setVoting("down");

    locate({ setView: false, maxZoom: 15 })
      .then((position) => onDownvote?.(position))
      .finally(() => {
        setVoting(false);
      });
  }, [locate, onDownvote]);

  return (
    <Popup autoClose={false}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <button
            className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed"
            onClick={onUpvoteRequest}
            disabled={voting !== false}
          >
            {voting === "up" ? <Spinner /> : <ChevronUp className="h-8 w-8" />}
          </button>
          <div className="text-lg font-semibold">{props.score}</div>
          <button
            className="cursor-pointer text-slate-600 hover:text-slate-800"
            onClick={onDownvoteRequest}
            disabled={voting !== false}
          >
            {voting === "down" ? (
              <Spinner />
            ) : (
              <ChevronDown className="h-8 w-8" />
            )}
          </button>
        </div>
        <div className="space-y-1">
          <div className="text-base font-semibold">{t("title")}</div>
          <div className="text-sm font-semibold">{t("location")}</div>
          <div className="flex items-center gap-2">
            <div className="text-xs">
              {props.position[0].toFixed(7)} / {props.position[1].toFixed(7)}{" "}
              (lat/lng)
            </div>
            <button
              className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed"
              disabled={voting !== false}
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
            {t("openInGoogleMaps")}
          </Link>
        </div>
      </div>
    </Popup>
  );
}

interface LocationMarkerProps {
  position: [number, number];
  score: number;
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
}

export function LocationMarker(props: LocationMarkerProps) {
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
      <LocationMarkerPopup {...props} />
    </Marker>
  );
}
