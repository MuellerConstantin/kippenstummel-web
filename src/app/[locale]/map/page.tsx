"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import useApi from "@/hooks/useApi";
import { AxiosError } from "axios";
import { useSWRConfig } from "swr";
import { Link } from "@/components/atoms/Link";
import { GeoCoordinates } from "@/lib/types/geo";

const CvmOptInMap = dynamic(
  () =>
    import("@/components/organisms/map/CvmOptInMap").then(
      (module) => module.CvmOptInMap,
    ),
  { ssr: false },
);

export default function Map() {
  const t = useTranslations();
  const api = useApi();
  const { enqueue } = useNotifications();
  const { mutate } = useSWRConfig();

  const searchParams = useSearchParams();
  const shared = searchParams.get("shared");

  const onRegister = useCallback(
    async (position: GeoCoordinates) => {
      try {
        await api.post("/cvms", {
          latitude: position.latitude,
          longitude: position.longitude,
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
      position: GeoCoordinates,
      editorPosition: GeoCoordinates,
    ) => {
      try {
        await api.patch(`/cvms/${id}`, {
          repositionedLatitude: position.latitude,
          repositionedLongitude: position.longitude,
          editorLatitude: editorPosition.latitude,
          editorLongitude: editorPosition.longitude,
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
    async (id: string, position: GeoCoordinates) => {
      try {
        await api.post(`/cvms/${id}/upvote`, {
          latitude: position.latitude,
          longitude: position.longitude,
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
    async (id: string, position: GeoCoordinates) => {
      try {
        await api.post(`/cvms/${id}/downvote`, {
          latitude: position.latitude,
          longitude: position.longitude,
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
      position: GeoCoordinates,
      type: "missing" | "spam" | "inactive" | "inaccessible",
    ) => {
      try {
        await api.post(`/cvms/${id}/report`, {
          latitude: position.latitude,
          longitude: position.longitude,
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
