"use client";

import { useEffect, useRef } from "react";
import * as ackeeTracker from "ackee-tracker";
import type { AckeeTrackingReturn } from "ackee-tracker";
import { usePathname } from "next/navigation";

export function AckeeTracker() {
  const pathname = usePathname();
  const trackerRef = useRef<AckeeTrackingReturn | null>(null);

  useEffect(() => {
    const tracker = ackeeTracker.create(process.env.NEXT_PUBLIC_ACKEE_SERVER!, {
      detailed: false,
      ignoreLocalhost: true,
      ignoreOwnVisits: true,
    });

    if (trackerRef.current) {
      trackerRef.current.stop();
    }

    trackerRef.current = tracker.record(process.env.NEXT_PUBLIC_ACKEE_DOMAIN!);

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stop();
      }
    };
  }, [pathname]);

  return null;
}
