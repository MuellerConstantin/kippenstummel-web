"use client";

import { useEffect, useRef } from "react";
import * as ackeeTracker from "ackee-tracker";
import type { AckeeTrackingReturn } from "ackee-tracker";
import { usePathname } from "next/navigation";
import { useEnv } from "@/contexts/RuntimeConfigProvider";

export function AckeeTracker() {
  const ackeeServer = useEnv("NEXT_PUBLIC_ACKEE_SERVER");
  const ackeeDomain = useEnv("NEXT_PUBLIC_ACKEE_DOMAIN");

  const pathname = usePathname();
  const trackerRef = useRef<AckeeTrackingReturn | null>(null);

  useEffect(() => {
    if (ackeeServer && ackeeDomain) {
      const tracker = ackeeTracker.create(ackeeServer, {
        detailed: false,
        ignoreLocalhost: true,
        ignoreOwnVisits: true,
      });

      if (trackerRef.current) {
        trackerRef.current.stop();
      }

      trackerRef.current = tracker.record(ackeeDomain);

      return () => {
        if (trackerRef.current) {
          trackerRef.current.stop();
        }
      };
    }
  }, [pathname, ackeeServer, ackeeDomain]);

  return null;
}
