"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const t = useTranslations("OfflineBanner");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function updateStatus() {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-green-600 text-white">
      <div className="p-1 text-sm md:flex md:items-center md:justify-center">
        {t("message")}
      </div>
    </div>
  );
}
