"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import Leaflet from "leaflet";
import { CvmOptInMap } from "@/components/organisms/map/CvmOptInMap";
import { useNotifications } from "@/contexts/NotificationProvider";
import useApi from "@/hooks/useApi";
import { AxiosError } from "axios";

export default function Map() {
  const t = useTranslations();
  const api = useApi();
  const { enqueue } = useNotifications();

  const onReport = useCallback(
    async (position: Leaflet.LatLng) => {
      try {
        await api.post("/cvms", {
          latitude: position.lat,
          longitude: position.lng,
        });
      } catch {
        enqueue(
          {
            title: t("Notifications.cvmReportedFailed.title"),
            description: t("Notifications.cvmReportedFailed.description"),
            variant: "error",
          },
          { timeout: 5000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmReported.title"),
          description: t("Notifications.cvmReported.description"),
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

  return (
    <div className="flex h-0 grow flex-col">
      <CvmOptInMap
        onReport={onReport}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
      />
    </div>
  );
}
