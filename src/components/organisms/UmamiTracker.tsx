"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useEnv } from "@/contexts/RuntimeConfigProvider";
import { useAppSelector } from "@/store";
import { filterUmamiPayload, type UmamiPayload } from "@/lib/client/umami";

const BEFORE_SEND_HANDLER = "kippenstummelUmamiBeforeSend";

declare global {
  interface Window {
    /** Called by the Umami tracker before every send, see `data-before-send`. */
    [BEFORE_SEND_HANDLER]?: (
      type: string,
      payload: UmamiPayload,
    ) => UmamiPayload;
  }
}

export function UmamiTracker() {
  const umamiServer = useEnv("NEXT_PUBLIC_UMAMI_SERVER");
  const umamiWebsiteId = useEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID");

  const allowAnalyticsCookies = useAppSelector(
    (state) => state.privacy.allowAnalyticsCookies,
  );

  const allowAnalyticsRef = useRef(allowAnalyticsCookies);
  const [isHandlerRegistered, setIsHandlerRegistered] = useState(false);

  useEffect(() => {
    allowAnalyticsRef.current = allowAnalyticsCookies;
  }, [allowAnalyticsCookies]);

  /*
   * The tracker sends its first page view as soon as it has loaded. The
   * handler has to be in place before that, otherwise the first payload would
   * go out unfiltered. Hence the script is only rendered once it exists.
   */
  useEffect(() => {
    window[BEFORE_SEND_HANDLER] = (_type, payload) =>
      filterUmamiPayload(payload, allowAnalyticsRef.current);
    setIsHandlerRegistered(true);

    return () => {
      delete window[BEFORE_SEND_HANDLER];
    };
  }, []);

  if (!umamiServer || !umamiWebsiteId || !isHandlerRegistered) {
    return null;
  }

  return (
    <Script
      src={`${umamiServer.replace(/\/$/, "")}/script.js`}
      data-website-id={umamiWebsiteId}
      data-before-send={BEFORE_SEND_HANDLER}
      strategy="afterInteractive"
    />
  );
}
