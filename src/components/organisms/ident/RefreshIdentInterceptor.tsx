"use client";

import { useEffect, useState, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import { DialogTrigger } from "react-aria-components";
import { Modal } from "@/components/atoms/Modal";
import { ConfirmIdentDialog } from "@/components/organisms/ident/ConfirmIdentDialog";
import useApi from "@/hooks/useApi";

export function RefreshIdentInterceptor({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = useApi();

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
          err.response.data?.code === "INVALID_IDENT_TOKEN_ERROR" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

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

  return (
    <>
      {children}
      <DialogTrigger isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Modal>
          <ConfirmIdentDialog onConfirm={onConfirm} />
        </Modal>
      </DialogTrigger>
    </>
  );
}
