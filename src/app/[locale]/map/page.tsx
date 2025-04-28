"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import Leaflet from "leaflet";
import { CvmOptInMap } from "@/components/organisms/map/CvmOptInMap";
import { useNotifications } from "@/contexts/NotificationProvider";
import useApi from "@/hooks/useApi";

export default function Map() {
  const t = useTranslations();
  const api = useApi();
  const { enqueue } = useNotifications();

  const onReport = useCallback(
    async (position: Leaflet.LatLng) => {
      try {
        await api.post("/cvm", {
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
    async (id: string) => {
      try {
        await api.post(`/cvm/${id}`);
      } catch {
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
    async (id: string) => {
      try {
        await api.delete(`/cvm/${id}`);
      } catch {
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
