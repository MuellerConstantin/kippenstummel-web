"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useRef } from "react";

export function OfflineHandler() {
  const router = useRouter();

  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const goToOnline = () => {
      routerRef.current.replace("/map");
    };

    const goToOffline = () => {
      routerRef.current.replace("/offline");
    };

    window.addEventListener("online", goToOnline);
    window.addEventListener("offline", goToOffline);

    if (!window.navigator.onLine) {
      goToOffline();
    }

    return () => {
      window.removeEventListener("online", goToOnline);
      window.removeEventListener("offline", goToOffline);
    };
  }, []);

  return null;
}
