"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Leaflet from "leaflet";
import { CvmOptInMap } from "@/components/organisms/map/CvmOptInMap";
import { useNotifications } from "@/contexts/NotificationProvider";
import useApi from "@/hooks/useApi";
import { AxiosError } from "axios";
import useSWR from "swr";

export default function Map() {
  const t = useTranslations();
  const api = useApi();
  const { enqueue } = useNotifications();

  const searchParams = useSearchParams();
  const shared = searchParams.get("shared");

  const { data, error } = useSWR<
    {
      id: string;
      latitude: number;
      longitude: number;
      score: number;
    },
    unknown,
    string | null
  >(
    shared ? `/cvms/${shared}` : null,
    (url) => api.get(url).then((res) => res.data),
    { shouldRetryOnError: false, revalidateOnFocus: false },
  );

  const onRegister = useCallback(
    async (position: Leaflet.LatLng) => {
      try {
        await api.post("/cvms", {
          latitude: position.lat,
          longitude: position.lng,
        });
      } catch {
        enqueue(
          {
            title: t("Notifications.cvmRegisterFailed.title"),
            description: t("Notifications.cvmRegisterFailed.description"),
            variant: "error",
          },
          { timeout: 5000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmRegistered.title"),
          description: t("Notifications.cvmRegistered.description"),
          variant: "success",
        },
        { timeout: 5000 },
      );
    },
    [t, api, enqueue],
  );

  const onUpvote = useCallback(
    async (id: string, position: Leaflet.LatLng) => {
      try {
        await api.post(`/cvms/${id}/upvote`, {
          latitude: position.lat,
          longitude: position.lng,
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          if (
            err.response?.status === 403 &&
            err.response.data.code === "OUT_OF_REACH_ERROR"
          ) {
            enqueue(
              {
                title: t("Notifications.cvmOutOfReach.title"),
                description: t("Notifications.cvmOutOfReach.description"),
                variant: "info",
              },
              { timeout: 5000 },
            );
            return;
          }
        }

        console.error(err);

        enqueue(
          {
            title: t("Notifications.cvmVoteFailed.title"),
            description: t("Notifications.cvmVoteFailed.description"),
            variant: "error",
          },
          { timeout: 5000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmVoted.title"),
          description: t("Notifications.cvmVoted.description"),
          variant: "success",
        },
        { timeout: 5000 },
      );
    },
    [t, api, enqueue],
  );

  const onDownvote = useCallback(
    async (id: string, position: Leaflet.LatLng) => {
      try {
        await api.post(`/cvms/${id}/downvote`, {
          latitude: position.lat,
          longitude: position.lng,
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          if (
            err.response?.status === 403 &&
            err.response.data.code === "OUT_OF_REACH_ERROR"
          ) {
            enqueue(
              {
                title: t("Notifications.cvmOutOfReach.title"),
                description: t("Notifications.cvmOutOfReach.description"),
                variant: "info",
              },
              { timeout: 5000 },
            );
            return;
          }
        }

        console.error(err);

        enqueue(
          {
            title: t("Notifications.cvmVoteFailed.title"),
            description: t("Notifications.cvmVoteFailed.description"),
            variant: "error",
          },
          { timeout: 5000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmVoted.title"),
          description: t("Notifications.cvmVoted.description"),
          variant: "success",
        },
        { timeout: 5000 },
      );
    },
    [t, api, enqueue],
  );

  useEffect(() => {
    if (error) {
      enqueue(
        {
          title: t("Notifications.sharedNotFound.title"),
          description: t("Notifications.sharedNotFound.description"),
          variant: "error",
        },
        { timeout: 5000 },
      );
    }
  }, [error, enqueue, t]);

  return (
    <div className="flex h-0 grow flex-col">
      <CvmOptInMap
        onRegister={onRegister}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        selectedCvm={data}
      />
    </div>
  );
}
