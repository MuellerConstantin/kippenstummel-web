"use client";

import { useEffect, useState, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { DialogTrigger } from "react-aria-components";
import { Modal } from "@/components/atoms/Modal";
import { RequestIdentDialog } from "@/components/organisms/ident/RequestIdentDialog";
import useApi from "@/hooks/useApi";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useTranslations } from "next-intl";

export function RequireIdentInterceptor({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = useApi();
  const { enqueue } = useNotifications();
  const t = useTranslations();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingQueue, setPendingQueue] = useState<
    {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
      request: AxiosRequestConfig;
    }[]
  >([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;

        if (
          err.response?.status === 401 &&
          (err.response.data?.code === "INVALID_IDENT_TOKEN_ERROR" ||
            err.response.data?.code === "UNKNOWN_IDENTITY_ERROR") &&
          !originalRequest._retryRequire
        ) {
          originalRequest._retryRequire = true;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              setPendingQueue((queue) => [
                ...queue,
                { resolve, reject, request: originalRequest },
              ]);
            });
          }

          setIsRefreshing(true);
          setIsDialogOpen(true);

          return new Promise((resolve, reject) => {
            setPendingQueue((queue) => [
              ...queue,
              {
                resolve,
                reject,
                request: originalRequest,
              },
            ]);
          });
        }

        return Promise.reject(err);
      },
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [isRefreshing, api]);

  const onConfirm = useCallback(async () => {
    pendingQueue.forEach(({ resolve, request }) => {
      resolve(api(request));
    });

    setPendingQueue([]);
    setIsRefreshing(false);
  }, [pendingQueue, api]);

  const onCancel = useCallback(() => {
    pendingQueue.forEach(({ reject }) => {
      reject();
    });

    setPendingQueue([]);
    setIsRefreshing(false);

    enqueue(
      {
        title: t("Notifications.canceledIdentityCreation.title"),
        description: t("Notifications.canceledIdentityCreation.description"),
        variant: "error",
      },
      { timeout: 5000 },
    );
  }, [pendingQueue, enqueue, t]);

  return (
    <>
      {children}
      <DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Modal>
          <RequestIdentDialog onConfirm={onConfirm} onCancel={onCancel} />
        </Modal>
      </DialogTrigger>
    </>
  );
}
