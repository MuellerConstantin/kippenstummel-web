"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AxiosRequestConfig } from "axios";
import { RequestIdentDialog } from "@/components/organisms/ident/RequestIdentDialog";
import useApi from "@/hooks/useApi";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/store";
import identSlice from "@/store/slices/ident";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";

type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  request: AxiosRequestConfig;
};

export function RequireIdentInterceptor({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = useApi();
  const store = useAppStore();
  const { enqueue } = useNotifications();
  const t = useTranslations();

  const refreshPromiseRef = useRef<Promise<void> | null>(null);
  const pendingQueueRef = useRef<QueueItem[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queueRequest = useCallback(
    (request: AxiosRequestConfig) =>
      new Promise((resolve, reject) => {
        pendingQueueRef.current.push({ resolve, reject, request });
      }),
    [],
  );

  const flushQueue = useCallback(() => {
    pendingQueueRef.current.forEach(({ resolve, request }) => {
      resolve(api(request));
    });
    pendingQueueRef.current = [];
  }, [api]);

  const rejectQueue = useCallback(() => {
    pendingQueueRef.current.forEach(({ reject }) => reject());
    pendingQueueRef.current = [];
  }, []);

  const onConfirm = useCallback(() => {
    flushQueue();
    setIsDialogOpen(false);
  }, [flushQueue]);

  const onCancel = useCallback(() => {
    rejectQueue();
    setIsDialogOpen(false);

    enqueue(
      {
        title: t("Notifications.canceledIdentityCreation.title"),
        description: t("Notifications.canceledIdentityCreation.description"),
        variant: "error",
      },
      { timeout: 10000 },
    );
  }, [enqueue, rejectQueue, t]);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const { response, config } = err;

        // Non-authentication error, reject immediately
        if (!response || response.status !== 401) {
          return Promise.reject(err);
        }

        const code = response.data?.code;
        const originalRequest = config;

        // Already handled retry for this request and unexpected error occurred, reject to avoid infinite loop
        if (originalRequest._retryHandled) {
          return Promise.reject(err);
        }

        originalRequest._retryHandled = true;

        // Present identity is unknown, require new identity creation
        if (code === "UNKNOWN_IDENTITY_ERROR") {
          setIsDialogOpen(true);
          return queueRequest(originalRequest);
        }

        // Token is invalid (e.g. expired), attempt refresh if possible
        if (code === "INVALID_IDENT_TOKEN_ERROR") {
          const state = store.getState();

          // No identity or secret available, require identity creation
          if (!state.ident.identity || !state.ident.secret) {
            setIsDialogOpen(true);
            return queueRequest(originalRequest);
          }

          try {
            if (!refreshPromiseRef.current) {
              refreshPromiseRef.current = api
                .post("/ident", {
                  identity: state.ident.identity,
                  secret: state.ident.secret,
                })
                .then((res) => {
                  store.dispatch(identSlice.actions.setToken(res.data.token));
                })
                .finally(() => {
                  refreshPromiseRef.current = null;
                });
            }

            await refreshPromiseRef.current;

            return api(originalRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (refreshError: any) {
            // If refresh fails due to unknown identity, require identity creation
            if (
              refreshError.response?.status === 401 &&
              refreshError.response?.data?.code === "UNKNOWN_IDENTITY_ERROR"
            ) {
              setIsDialogOpen(true);
              return queueRequest(originalRequest);
            }

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(err);
      },
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [queueRequest, api, store, onConfirm]);

  return (
    <>
      {children}
      <AnimatedDialogModal isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <RequestIdentDialog onConfirm={onConfirm} onCancel={onCancel} />
      </AnimatedDialogModal>
    </>
  );
}
