"use client";

import { createContext, useContext, useMemo } from "react";
import { ToastQueue } from "@/components/atoms/Toast";

export interface Notification {
  title: string;
  description: string;
  variant?: "default" | "success" | "error" | "info";
}

const notificationContext = createContext<{
  queue: ToastQueue;
  enqueue: (notification: Notification, options?: { timeout: number }) => void;
} | null>(null);

export function NotificationProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queue = useMemo(() => new ToastQueue(), []);

  const enqueue = (
    notification: Notification,
    options?: { timeout: number },
  ) => {
    queue.add(notification, options);
  };

  return (
    <notificationContext.Provider value={{ queue, enqueue }}>
      {children}
    </notificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(notificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a 'NotificationProvider'",
    );
  }

  return context;
}
