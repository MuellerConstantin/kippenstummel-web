"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Leaflet from "leaflet";
import { CvmOptInMap } from "@/components/organisms/map/CvmOptInMap";
import { useNotifications } from "@/contexts/NotificationProvider";
import useApi from "@/hooks/useApi";
import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import { Link } from "@/components/atoms/Link";

export default function Map() {
  const t = useTranslations();
  const api = useApi();
  const { enqueue } = useNotifications();
  const { mutate } = useSWRConfig();

  const searchParams = useSearchParams();
  const shared = searchParams.get("shared");

  const onRegister = useCallback(
    async (position: Leaflet.LatLng) => {
      try {
        await api.post("/cvms", {
          latitude: position.lat,
          longitude: position.lng,
        });

        mutate(
          (key) => typeof key === "string" && /^\/cvms(\b|\/|\?).*/.test(key),
        );
      } catch (err) {
        if (err instanceof AxiosError) {
          if (
            err.response?.status === 429 &&
            err.response.data.code === "THROTTLED_ERROR"
          ) {
            enqueue(
              {
                title: t("Notifications.cvmRegisterThrottled.title"),
                description: t.rich(
                  "Notifications.cvmRegisterThrottled.description",
                  {
                    link: (chunks) => <Link href="/home#faq-7">{chunks}</Link>,
                  },
                ),
                variant: "info",
              },
              { timeout: 10000 },
            );
            return;
          }
        }

        enqueue(
          {
            title: t("Notifications.cvmRegisterFailed.title"),
            description: t("Notifications.cvmRegisterFailed.description"),
            variant: "error",
          },
          { timeout: 10000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmRegistered.title"),
          description: t("Notifications.cvmRegistered.description"),
          variant: "success",
        },
        { timeout: 10000 },
      );
    },
    [t, api, enqueue, mutate],
  );

  const onReposition = useCallback(
    async (
      id: string,
      position: Leaflet.LatLng,
      editorPosition: Leaflet.LatLng,
    ) => {
      try {
        await api.patch(`/cvms/${id}`, {
          repositionedLatitude: position.lat,
          repositionedLongitude: position.lng,
          editorLatitude: editorPosition.lat,
          editorLongitude: editorPosition.lng,
        });

        mutate(
          (key) => typeof key === "string" && /^\/cvms(\b|\/|\?).*/.test(key),
        );
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
              { timeout: 10000 },
            );
            return;
          } else if (
            err.response?.status === 429 &&
            err.response.data.code === "THROTTLED_ERROR"
          ) {
            enqueue(
              {
                title: t("Notifications.cvmRepositionThrottled.title"),
                description: t.rich(
                  "Notifications.cvmRepositionThrottled.description",
                  {
                    link: (chunks) => <Link href="/home#faq-7">{chunks}</Link>,
                  },
                ),
                variant: "info",
              },
              { timeout: 10000 },
            );
            return;
          }
        }

        enqueue(
          {
            title: t("Notifications.cvmRepositionFailed.title"),
            description: t("Notifications.cvmRepositionFailed.description"),
            variant: "error",
          },
          { timeout: 10000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmRepositioned.title"),
          description: t("Notifications.cvmRepositioned.description"),
          variant: "success",
        },
        { timeout: 10000 },
      );
    },
    [t, api, enqueue, mutate],
  );

  const onUpvote = useCallback(
    async (id: string, position: Leaflet.LatLng) => {
      try {
        await api.post(`/cvms/${id}/upvote`, {
          latitude: position.lat,
          longitude: position.lng,
        });

        mutate(
          (key) => typeof key === "string" && /^\/cvms(\b|\/|\?).*/.test(key),
        );
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
              { timeout: 10000 },
            );
            return;
          }
        }

        enqueue(
          {
            title: t("Notifications.cvmVoteFailed.title"),
            description: t("Notifications.cvmVoteFailed.description"),
            variant: "error",
          },
          { timeout: 10000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmVoted.title"),
          description: t("Notifications.cvmVoted.description"),
          variant: "success",
        },
        { timeout: 10000 },
      );
    },
    [t, api, enqueue, mutate],
  );

  const onDownvote = useCallback(
    async (id: string, position: Leaflet.LatLng) => {
      try {
        await api.post(`/cvms/${id}/downvote`, {
          latitude: position.lat,
          longitude: position.lng,
        });

        mutate(
          (key) => typeof key === "string" && /^\/cvms(\b|\/|\?).*/.test(key),
        );
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
              { timeout: 10000 },
            );
            return;
          }
        }

        enqueue(
          {
            title: t("Notifications.cvmVoteFailed.title"),
            description: t("Notifications.cvmVoteFailed.description"),
            variant: "error",
          },
          { timeout: 10000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmVoted.title"),
          description: t("Notifications.cvmVoted.description"),
          variant: "success",
        },
        { timeout: 10000 },
      );
    },
    [t, api, enqueue, mutate],
  );

  const onReport = useCallback(
    async (
      id: string,
      position: Leaflet.LatLng,
      type: "missing" | "spam" | "inactive" | "inaccessible",
    ) => {
      try {
        await api.post(`/cvms/${id}/report`, {
          latitude: position.lat,
          longitude: position.lng,
          type,
        });

        mutate(
          (key) => typeof key === "string" && /^\/cvms(\b|\/|\?).*/.test(key),
        );
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
              { timeout: 10000 },
            );
            return;
          }
        }

        enqueue(
          {
            title: t("Notifications.cvmReportFailed.title"),
            description: t("Notifications.cvmReportFailed.description"),
            variant: "error",
          },
          { timeout: 10000 },
        );
        return;
      }

      enqueue(
        {
          title: t("Notifications.cvmReported.title"),
          description: t("Notifications.cvmReported.description"),
          variant: "success",
        },
        { timeout: 10000 },
      );
    },
    [t, api, enqueue, mutate],
  );

  return (
    <div className="flex grow flex-col">
      <CvmOptInMap
        onRegister={onRegister}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        onReposition={onReposition}
        onReport={onReport}
        sharedCvmId={shared}
      />
    </div>
  );
}
