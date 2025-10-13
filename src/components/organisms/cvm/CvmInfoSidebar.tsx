import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronUp,
  ChevronDown,
  Equal,
  Copy,
  Check,
  X,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/components/atoms/Link";
import { Spinner } from "@/components/atoms/Spinner";
import useLocate from "@/hooks/useLocate";
import { Button } from "@/components/atoms/Button";
import Image from "next/image";
import { REPORT_THRESHOLD } from "@/lib/constants";
import { Cvm } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";

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

interface ReportedMessageProps {
  cvm: Cvm;
}

function ReportedMessage({ cvm }: ReportedMessageProps) {
  const t = useTranslations("CvmInfoDialog");
  const reports = cvm.recentlyReported;
  const entries = Object.entries(reports);
  const filtered = entries.filter(([, count]) => count >= REPORT_THRESHOLD);

  if (filtered.length === 0) return null;

  const [worstType, count] = filtered.reduce((max, curr) =>
    curr[1] > max[1] ? curr : max,
  );

  return (
    <div className="rounded-md bg-amber-200 p-2 text-xs text-amber-600 dark:bg-amber-600 dark:text-amber-200">
      {t.rich(`reported.${worstType}`, {
        count,
        b: (chunks) => <span className="font-semibold">{chunks}</span>,
      })}
    </div>
  );
}

export interface CvmInfoSidebarProps {
  cvm: Cvm;
  onClose: () => void;
  onUpvote?: (voterPosition: GeoCoordinates) => void;
  onDownvote?: (voterPosition: GeoCoordinates) => void;
  onReposition?: (editorPosition: GeoCoordinates) => void;
  onReport?: (reporterPosition: GeoCoordinates) => void;
}

export function CvmInfoSidebar(props: CvmInfoSidebarProps) {
  const t = useTranslations("CvmInfoDialog");
  const locate = useLocate();
  const { onUpvote, onDownvote, onReposition, onReport } = props;

  const [voting, setVoting] = useState<"up" | "down" | false>(false);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const onUpvoteRequest = useCallback(() => {
    setVoting("up");

    locate()
      .then((position) => onUpvote?.(position))
      .finally(() => {
        setVoting(false);
      });
  }, [locate, onUpvote]);

  const onDownvoteRequest = useCallback(() => {
    setVoting("down");

    locate()
      .then((position) => onDownvote?.(position))
      .finally(() => {
        setVoting(false);
      });
  }, [locate, onDownvote]);

  const onRepositionRequest = useCallback(() => {
    setIsRepositioning(true);

    locate()
      .then((position) => {
        onReposition?.(position);
      })
      .finally(() => {
        setIsRepositioning(false);
      });
  }, [locate, onReposition]);

  const onReportRequest = useCallback(() => {
    setIsReporting(true);

    locate()
      .then((position) => {
        onReport?.(position);
      })
      .finally(() => {
        setIsReporting(false);
      });
  }, [locate, onReport]);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      key="cvm-info-dialog"
      className="h-full w-[25rem] cursor-default"
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex h-full w-full flex-col overflow-y-auto rounded-md bg-white text-slate-900 shadow-[0_0_0_2px_#0000001a] dark:bg-slate-900 dark:text-white dark:shadow-[0_0_0_2px_#ffffff1a]">
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
          <div className="flex gap-2">
            {props.cvm.score < -8 ? (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-800">
                <X className="h-4 w-4 text-white" />
              </div>
            ) : props.cvm.score < 0 ? (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                <ChevronDown className="h-4 w-4 text-white" />
              </div>
            ) : props.cvm.score >= 5 ? (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600">
                <ChevronUp className="h-4 w-4 text-white" />
              </div>
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-500">
                <Equal className="h-4 w-4 text-white" />
              </div>
            )}
            <h2
              slot="title"
              className="my-0 truncate text-lg leading-6 font-semibold"
            >
              {t("title")}
            </h2>
          </div>
          <div className="flex grow flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed disabled:text-slate-400 dark:hover:!text-slate-200 ${props.cvm.alreadyVoted === "upvote" ? "border-green-600 bg-green-100 !text-green-600 dark:bg-green-900" : "border-slate-400 dark:border-slate-600"}`}
                    onClick={onUpvoteRequest}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={
                      voting !== false ||
                      isRepositioning ||
                      !!props.cvm.alreadyVoted
                    }
                  >
                    {voting === "up" ? (
                      <Spinner />
                    ) : (
                      <ChevronUp className="h-7 w-7" />
                    )}
                  </button>
                  <div className="text-xl font-bold">{props.cvm.score}</div>
                  <button
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed disabled:text-slate-400 dark:hover:!text-slate-200 ${props.cvm.alreadyVoted === "downvote" ? "border-green-600 bg-green-100 !text-green-600 dark:bg-green-900" : "border-slate-400 dark:border-slate-600"}`}
                    onClick={onDownvoteRequest}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={
                      voting !== false ||
                      isRepositioning ||
                      !!props.cvm.alreadyVoted
                    }
                  >
                    {voting === "down" ? (
                      <Spinner />
                    ) : (
                      <ChevronDown className="h-7 w-7" />
                    )}
                  </button>
                </div>
                <div className="flex grow flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-semibold">{t("location")}</div>
                    <div className="text-sm">
                      {props.cvm.latitude.toFixed(7)} /{" "}
                      {props.cvm.longitude.toFixed(7)} (lat/lng)
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
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
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`https://www.google.com.sa/maps/search/${props.cvm.latitude},${props.cvm.longitude}`}
                        target="_blank"
                        className="flex h-8 items-center justify-center rounded-full bg-slate-200 p-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        <div className="relative h-4 w-4 overflow-hidden">
                          <Image
                            src="/icons/google-maps.svg"
                            alt="WhatsApp"
                            fill
                            objectFit="contain"
                            layout="fill"
                          />
                        </div>
                      </Link>
                      <Link
                        href={`whatsapp://send?text=${encodeURI(`${window.location.protocol}//${window.location.host}/map?shared=${props.cvm.id}`)}`}
                        target="_blank"
                        className="flex h-8 items-center justify-center rounded-full bg-slate-200 p-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                      >
                        <div className="relative h-4 w-4 overflow-hidden">
                          <Image
                            src="/icons/whatsapp.svg"
                            alt="WhatsApp"
                            fill
                            objectFit="contain"
                            layout="fill"
                          />
                        </div>
                      </Link>
                      {window.navigator.share && (
                        <Link
                          onPress={() =>
                            navigator.share({
                              url: `${window.location.protocol}//${window.location.host}/map?shared=${props.cvm.id}`,
                            })
                          }
                          className="flex h-8 items-center justify-center rounded-full bg-slate-200 p-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                          <Share2 className="h-4 w-4 text-slate-800 dark:text-slate-200" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <ReportedMessage cvm={props.cvm} />
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
    </motion.div>
  );
}
