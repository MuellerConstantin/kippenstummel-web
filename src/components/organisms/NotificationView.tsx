"use client";

import { ToastRegion } from "@/components/atoms/Toast";
import { useNotifications } from "@/contexts/NotificationProvider";

export function NotificationView() {
  const { queue } = useNotifications();

  return <ToastRegion queue={queue} />;
}
