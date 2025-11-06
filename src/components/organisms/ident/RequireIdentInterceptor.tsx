"use client";

import { useEffect, useState, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { RequestIdentDialog } from "@/components/organisms/ident/RequestIdentDialog";
import useApi from "@/hooks/useApi";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/store";
import identSlice from "@/store/slices/ident";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";

export function RequireIdentInterceptor({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = useApi();
  const store = useAppStore();
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
  const [isRequesting, setIsRequesting] = useState(false);

  const onConfirm = useCallback(async () => {
    pendingQueue.forEach(({ resolve, request }) => {
      resolve(api(request));
    });

    setPendingQueue([]);
    setIsRequesting(false);
  }, [pendingQueue, api]);

  const onCancel = useCallback(() => {
    pendingQueue.forEach(({ reject }) => {
      reject();
    });

    setPendingQueue([]);
    setIsRequesting(false);

    enqueue(
      {
        title: t("Notifications.canceledIdentityCreation.title"),
        description: t("Notifications.canceledIdentityCreation.description"),
        variant: "error",
      },
      { timeout: 10000 },
    );
  }, [pendingQueue, enqueue, t]);

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const handleRefresh = async () => {
          const { response, config } = err;

          if (
            response.status === 401 &&
            response.data?.code === "INVALID_IDENT_TOKEN_ERROR" &&
            !config._retryRefresh
          ) {
            // Try refresh only for non-ident requests
            if (response && config.url !== "/ident") {
              config._retryRefresh = true;
              const state = store.getState();

              // Refresh is only possible if identity and secret are available
              if (state.ident.identity && state.ident.secret) {
                if (!isRefreshing) {
                  setIsRefreshing(true);

                  try {
                    const refreshRes = await api.post<{
                      identity: string;
                      token: string;
                    }>("/ident", {
                      identity: state.ident.identity,
                      secret: state.ident.secret,
                    });

                    store.dispatch(
                      identSlice.actions.setToken(refreshRes.data.token),
                    );

                    onConfirm();
                    return api(config);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } catch (refeshError: any) {
                    return Promise.reject(refeshError);
                  } finally {
                    setIsRefreshing(false);
                  }
                }

                return new Promise((resolve, reject) => {
                  setPendingQueue((queue) => [
                    ...queue,
                    {
                      resolve,
                      reject,
                      request: config,
                    },
                  ]);
                });
              }
            }
          }

          return Promise.reject(err);
        };

        const handleRequest = async () => {
          const originalRequest = err.config;

          if (
            err.response &&
            err.response?.status === 401 &&
            (err.response.data?.code === "INVALID_IDENT_TOKEN_ERROR" ||
              err.response.data?.code === "UNKNOWN_IDENTITY_ERROR") &&
            !originalRequest._retryRequire
          ) {
            originalRequest._retryRequire = true;

            if (isRequesting && err.config.url !== "/ident") {
              return new Promise((resolve, reject) => {
                setPendingQueue((queue) => [
                  ...queue,
                  { resolve, reject, request: originalRequest },
                ]);
              });
            }

            setIsRequesting(true);
            setIsDialogOpen(true);

            if (err.config.url !== "/ident") {
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
          }

          return Promise.reject(err);
        };

        return handleRefresh().catch(handleRequest);
      },
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [isRequesting, isRefreshing, api, store, onConfirm]);

  return (
    <>
      {children}
      <AnimatedDialogModal isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <RequestIdentDialog onConfirm={onConfirm} onCancel={onCancel} />
      </AnimatedDialogModal>
    </>
  );
}
