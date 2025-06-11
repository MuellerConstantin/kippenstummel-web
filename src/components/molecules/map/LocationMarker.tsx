import { useCallback, useState } from "react";
import Leaflet from "leaflet";
import { Marker, Popup, useMap } from "react-leaflet";
import { useTranslations } from "next-intl";
import LeafletDivIcon from "@/components/organisms/leaflet/LeafletDivIcon";
import {
  MapPin,
  ChevronUp,
  ChevronDown,
  Equal,
  Copy,
  Check,
  X,
} from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { Spinner } from "@/components/atoms/Spinner";
import useLocate from "@/hooks/useLocate";
import { Modal } from "@/components/atoms/Modal";
import { Dialog } from "@/components/atoms/Dialog";
import { Heading } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import useIsMobile from "@/hooks/useIsMobile";

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
}

function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(props.text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [props.text]);

  return (
    <button
      className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed"
      disabled={props.disabled}
      onClick={handleClick}
    >
      <div className="transition-all duration-300 ease-in-out">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </div>
    </button>
  );
}

interface LocationMarkerDialogProps {
  id: string;
  position: [number, number];
  score: number;
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
}

function LocationMarkerDialog(props: LocationMarkerDialogProps) {
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
    <Dialog>
      {({ close }) => (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              {props.score < -99 ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                  <ChevronDown className="h-4 w-4 text-white" />
                </div>
              ) : props.score > 99 ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600">
                  <ChevronUp className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-500">
                  <Equal className="h-4 w-4 text-white" />
                </div>
              )}
              <Heading
                slot="title"
                className="my-0 truncate text-lg leading-6 font-semibold"
              >
                {t("title")}
              </Heading>
            </div>
            <div>
              <Button variant="icon" onPress={close}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <button
                  className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
                  onClick={onUpvoteRequest}
                  onMouseDown={(e) => e.stopPropagation()}
                  disabled={voting !== false}
                >
                  {voting === "up" ? (
                    <Spinner />
                  ) : (
                    <ChevronUp className="h-8 w-8" />
                  )}
                </button>
                <div className="text-lg font-semibold">
                  {(props.score / 100).toFixed(1)}
                </div>
                <button
                  className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
                  onClick={onDownvoteRequest}
                  onMouseDown={(e) => e.stopPropagation()}
                  disabled={voting !== false}
                >
                  {voting === "down" ? (
                    <Spinner />
                  ) : (
                    <ChevronDown className="h-8 w-8" />
                  )}
                </button>
              </div>
              <div className="flex grow flex-col gap-2">
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{t("location")}</div>
                  <div className="text-xs">
                    {props.position[0].toFixed(7)} /{" "}
                    {props.position[1].toFixed(7)} (lat/lng)
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">{t("share")}</div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={`${window.location.protocol}//${window.location.host}/map?shared=${props.id}`}
                      className="min-w-0 flex-1 rounded-md border-2 border-gray-300 bg-white px-1 py-0.5 text-xs text-gray-800 outline outline-0 focus:border-green-600 disabled:text-gray-200 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-300 dark:disabled:text-slate-600"
                    />
                    <CopyButton
                      text={`${window.location.protocol}//${window.location.host}/map?shared=${props.id}`}
                      disabled={voting !== false}
                    />
                  </div>
                  <Link
                    href={`https://www.google.com.sa/maps/search/${props.position[0]},${props.position[1]}`}
                    target="_blank"
                    className="block text-sm"
                  >
                    {t("openInGoogleMaps")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}

interface LocationMarkerPopupProps {
  id: string;
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
    <Popup
      autoClose={true}
      closeOnClick={false}
      closeButton={false}
      className="relative"
      offset={Leaflet.point(0, -15)}
    >
      {props.score < -99 ? (
        <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
          <ChevronDown className="h-4 w-4 text-white" />
        </div>
      ) : props.score > 99 ? (
        <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-600">
          <ChevronUp className="h-4 w-4 text-white" />
        </div>
      ) : (
        <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-500">
          <Equal className="h-4 w-4 text-white" />
        </div>
      )}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="text-base font-semibold">{t("title")}</div>
        </div>
        <div>
          <Button variant="icon" onPress={() => map.closePopup()}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <button
            className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
            onClick={onUpvoteRequest}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={voting !== false}
          >
            {voting === "up" ? <Spinner /> : <ChevronUp className="h-8 w-8" />}
          </button>
          <div className="text-lg font-semibold">
            {(props.score / 100).toFixed(1)}
          </div>
          <button
            className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
            onClick={onDownvoteRequest}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={voting !== false}
          >
            {voting === "down" ? (
              <Spinner />
            ) : (
              <ChevronDown className="h-8 w-8" />
            )}
          </button>
        </div>
        <div className="grow space-y-1">
          <div className="text-sm font-semibold">{t("location")}</div>
          <div className="text-xs">
            {props.position[0].toFixed(7)} / {props.position[1].toFixed(7)}{" "}
            (lat/lng)
          </div>
          <div className="flex w-full flex-col gap-1">
            <div className="text-sm font-semibold">{t("share")}</div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${window.location.protocol}//${window.location.host}/map?shared=${props.id}`}
                className="min-w-0 flex-1 rounded-md border-2 border-gray-300 bg-white px-1 py-0.5 text-xs text-gray-800 outline outline-0 focus:border-green-600 disabled:text-gray-200 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-300 dark:disabled:text-slate-600"
              />
              <CopyButton
                text={`${window.location.protocol}//${window.location.host}/map?shared=${props.id}`}
                disabled={voting !== false}
              />
            </div>
            <Link
              href={`https://www.google.com.sa/maps/search/${props.position[0]},${props.position[1]}`}
              target="_blank"
              className="block text-sm"
            >
              {t("openInGoogleMaps")}
            </Link>
          </div>
        </div>
      </div>
    </Popup>
  );
}

interface LocationMarkerProps {
  id: string;
  position: [number, number];
  score: number;
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
  selected: boolean;
}

export function LocationMarker(props: LocationMarkerProps) {
  const isMobile = useIsMobile();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Marker
        position={Leaflet.latLng(props.position[0], props.position[1])}
        icon={LeafletDivIcon({
          source: (
            <div
              className={`relative z-[50] h-fit w-fit ${showDialog || props.selected ? "animate-bounce" : ""}`}
            >
              {props.score < -99 ? (
                <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500">
                  <ChevronDown className="h-2.5 w-2.5 text-white" />
                </div>
              ) : props.score > 99 ? (
                <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-600">
                  <ChevronUp className="h-2.5 w-2.5 text-white" />
                </div>
              ) : (
                <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-500">
                  <Equal className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <MapPin className="h-[32px] w-[32px] fill-green-600 text-white" />
            </div>
          ),
          size: Leaflet.point(32, 32),
          anchor: Leaflet.point(16, 32),
        })}
        eventHandlers={{
          click: () => {
            if (isMobile) {
              setShowDialog(true);
            }
          },
        }}
      >
        {!isMobile && <LocationMarkerPopup {...props} />}
      </Marker>
      <Modal
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        placement="bottom"
      >
        <LocationMarkerDialog {...props} />
      </Modal>
    </>
  );
}
