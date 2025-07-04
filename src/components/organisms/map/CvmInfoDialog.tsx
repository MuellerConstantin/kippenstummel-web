import { useCallback, useEffect, useRef, useState } from "react";
import Leaflet from "leaflet";
import { useMap } from "react-leaflet";
import { useTranslations } from "next-intl";
import { ChevronUp, ChevronDown, Equal, Copy, Check, X } from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { Spinner } from "@/components/atoms/Spinner";
import useLocate from "@/hooks/useLocate";
import { Modal } from "@/components/atoms/Modal";
import { Dialog } from "@/components/atoms/Dialog";
import { Heading } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import useIsMobile from "@/hooks/useIsMobile";
import Image from "next/image";

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

interface CvmMobileDialogProps {
  cvm: {
    id: string;
    latitude: number;
    longitude: number;
    score: number;
  };
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
  onReposition?: (editorPosition: Leaflet.LatLng) => void;
  onReport?: (reporterPosition: Leaflet.LatLng) => void;
}

function CvmMobileDialog(props: CvmMobileDialogProps) {
  const t = useTranslations("CvmInfoDialog");
  const map = useMap();
  const locate = useLocate(map);
  const { onUpvote, onDownvote, onReposition, onReport } = props;

  const [voting, setVoting] = useState<"up" | "down" | false>(false);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

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

  const onRepositionRequest = useCallback(() => {
    setIsRepositioning(true);

    locate({ setView: true, maxZoom: 18 })
      .then((position) => {
        onReposition?.(position);
      })
      .finally(() => {
        setIsRepositioning(false);
      });
  }, [locate, onReposition]);

  const onReportRequest = useCallback(() => {
    setIsReporting(true);

    locate({ setView: true, maxZoom: 18 })
      .then((position) => {
        onReport?.(position);
      })
      .finally(() => {
        setIsReporting(false);
      });
  }, [locate, onReport]);

  return (
    <Dialog className="!p-0">
      {({ close }) => (
        <>
          <div className="relative">
            <div className="flex aspect-video w-full items-center justify-center bg-[#5bc15c] p-4 dark:bg-[#267528]">
              <div className="relative h-1/2 w-1/2 -rotate-15 overflow-hidden">
                <Image
                  src="/images/logo.svg"
                  alt="Placeholder"
                  fill
                  objectFit="contain"
                  layout="fill"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                {props.cvm.score < -100 ? (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                    <ChevronDown className="h-4 w-4 text-white" />
                  </div>
                ) : props.cvm.score > 100 ? (
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <button
                    className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
                    onClick={onUpvoteRequest}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={voting !== false || isRepositioning}
                  >
                    {voting === "up" ? (
                      <Spinner />
                    ) : (
                      <ChevronUp className="h-8 w-8" />
                    )}
                  </button>
                  <div className="text-lg font-semibold">
                    {(props.cvm.score / 100).toFixed(1)}
                  </div>
                  <button
                    className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
                    onClick={onDownvoteRequest}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={voting !== false || isRepositioning}
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
                    <div className="text-sm">
                      {props.cvm.latitude.toFixed(7)} /{" "}
                      {props.cvm.longitude.toFixed(7)} (lat/lng)
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-semibold">{t("share")}</div>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={`${window.location.protocol}//${window.location.host}/map?shared=${props.cvm.id}`}
                        className="min-w-0 flex-1 rounded-md border-2 border-gray-300 bg-white px-1 py-0.5 text-xs text-gray-800 outline outline-0 focus:border-green-600 disabled:text-gray-200 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-300 dark:disabled:text-slate-600"
                      />
                      <CopyButton
                        text={`${window.location.protocol}//${window.location.host}/map?shared=${props.cvm.id}`}
                        disabled={voting !== false}
                      />
                    </div>
                    <Link
                      href={`https://www.google.com.sa/maps/search/${props.cvm.latitude},${props.cvm.longitude}`}
                      target="_blank"
                      className="block text-sm"
                    >
                      {t("openInGoogleMaps")}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="flex cursor-pointer items-center gap-1 text-xs text-slate-500 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={onReportRequest}
                  disabled={isReporting || isRepositioning || voting !== false}
                >
                  <span>{t("report")}</span>
                  {isReporting && <Spinner size={14} />}
                </button>
                <button
                  className="flex cursor-pointer items-center gap-1 text-xs text-slate-500 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={onRepositionRequest}
                  disabled={isRepositioning || voting !== false}
                >
                  <span>{t("reposition")}</span>
                  {isRepositioning && <Spinner size={14} />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}

interface CvmSidebarDialogProps {
  cvm: {
    id: string;
    latitude: number;
    longitude: number;
    score: number;
  };
  onClose: () => void;
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
  onReposition?: (editorPosition: Leaflet.LatLng) => void;
  onReport?: (reporterPosition: Leaflet.LatLng) => void;
}

function CvmSidebarDialog(props: CvmSidebarDialogProps) {
  const t = useTranslations("CvmInfoDialog");
  const map = useMap();
  const locate = useLocate(map);
  const { onUpvote, onDownvote, onReposition, onReport } = props;

  const [voting, setVoting] = useState<"up" | "down" | false>(false);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

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

  const onRepositionRequest = useCallback(() => {
    setIsRepositioning(true);

    locate({ setView: true, maxZoom: 18 })
      .then((position) => {
        onReposition?.(position);
      })
      .finally(() => {
        setIsRepositioning(false);
      });
  }, [locate, onReposition]);

  const onReportRequest = useCallback(() => {
    setIsReporting(true);

    locate({ setView: true, maxZoom: 18 })
      .then((position) => {
        onReport?.(position);
      })
      .finally(() => {
        setIsReporting(false);
      });
  }, [locate, onReport]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      Leaflet.DomEvent.disableClickPropagation(containerRef.current);
      Leaflet.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-[25rem] cursor-default pt-3 pb-6 pl-3"
    >
      <div className="flex h-full w-full flex-col overflow-y-auto rounded-md border-2 border-slate-400 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
        <div className="relative">
          <div className="flex aspect-video w-full items-center justify-center bg-[#5bc15c] p-4 dark:bg-[#267528]">
            <div className="relative h-1/2 w-1/2 -rotate-15 overflow-hidden">
              <Image
                src="/images/logo.svg"
                alt="Placeholder"
                fill
                objectFit="contain"
                layout="fill"
              />
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Button variant="icon" onPress={props.onClose}>
              <X className="h-6 w-6 text-white dark:text-slate-400" />
            </Button>
          </div>
        </div>
        <div className="flex grow flex-col gap-4 p-4">
          <h2
            slot="title"
            className="my-0 truncate text-lg leading-6 font-semibold"
          >
            {t("title")}
          </h2>
          <div className="flex grow flex-col justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <button
                  className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
                  onClick={onUpvoteRequest}
                  onMouseDown={(e) => e.stopPropagation()}
                  disabled={voting !== false || isRepositioning}
                >
                  {voting === "up" ? (
                    <Spinner />
                  ) : (
                    <ChevronUp className="h-8 w-8" />
                  )}
                </button>
                <div className="text-lg font-semibold">
                  {(props.cvm.score / 100).toFixed(1)}
                </div>
                <button
                  className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:!text-slate-200"
                  onClick={onDownvoteRequest}
                  onMouseDown={(e) => e.stopPropagation()}
                  disabled={voting !== false || isRepositioning}
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
                  <div className="text-sm">
                    {props.cvm.latitude.toFixed(7)} /{" "}
                    {props.cvm.longitude.toFixed(7)} (lat/lng)
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">{t("share")}</div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={`${window.location.protocol}//${window.location.host}/map?shared=${props.cvm.id}`}
                      className="min-w-0 flex-1 rounded-md border-2 border-gray-300 bg-white px-1 py-0.5 text-xs text-gray-800 outline outline-0 focus:border-green-600 disabled:text-gray-200 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-300 dark:disabled:text-slate-600"
                    />
                    <CopyButton
                      text={`${window.location.protocol}//${window.location.host}/map?shared=${props.cvm.id}`}
                      disabled={voting !== false}
                    />
                  </div>
                  <Link
                    href={`https://www.google.com.sa/maps/search/${props.cvm.latitude},${props.cvm.longitude}`}
                    target="_blank"
                    className="block text-sm !text-green-600"
                  >
                    {t("openInGoogleMaps")}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="flex cursor-pointer items-center gap-1 text-xs text-slate-500 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={onReportRequest}
                disabled={isReporting || isRepositioning || voting !== false}
              >
                <span>{t("report")}</span>
                {isReporting && <Spinner size={14} />}
              </button>
              <button
                className="flex cursor-pointer items-center gap-1 text-xs text-slate-500 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={onRepositionRequest}
                disabled={isRepositioning || voting !== false}
              >
                <span>{t("reposition")}</span>
                {isRepositioning && <Spinner size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CvmInfoDialogProps {
  cvm: {
    id: string;
    latitude: number;
    longitude: number;
    score: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
  onReposition?: (editorPosition: Leaflet.LatLng) => void;
  onReport?: (reporterPosition: Leaflet.LatLng) => void;
}

export function CvmInfoDialog(props: CvmInfoDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Modal
        isOpen={props.open}
        onOpenChange={props.onOpenChange}
        placement="bottom"
      >
        <CvmMobileDialog {...props} />
      </Modal>
    );
  } else {
    return (
      <>
        {props.open && (
          <CvmSidebarDialog
            {...props}
            onClose={() => props.onOpenChange(false)}
          />
        )}
      </>
    );
  }
}
