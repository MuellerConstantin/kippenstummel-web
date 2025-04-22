"use client";

import { useCallback } from "react";
import Leaflet from "leaflet";
import { CvmMap } from "@/components/organisms/map/CvmMap";
import { useNotifications } from "@/contexts/NotificationProvider";
import useApi from "@/hooks/useApi";

export default function Map() {
  const api = useApi();
  const { enqueue } = useNotifications();

  const onReport = useCallback(async (position: Leaflet.LatLng) => {
    try {
      await api.post("/cvm", {
        latitude: position.lat,
        longitude: position.lng,
      });
    } catch (err: any) {
      enqueue(
        {
          title: "Report Failed",
          description: "There was an error submitting your report.",
          variant: "error",
        },
        { timeout: 5000 },
      );
      return;
    }

    enqueue(
      {
        title: "Reported",
        description: "Your report has been sent. Thanks for your help!",
        variant: "success",
      },
      { timeout: 5000 },
    );
  }, []);

  const onUpvote = useCallback(async (id: string) => {
    try {
      await api.post(`/cvm/${id}`);
    } catch (err: any) {
      enqueue(
        {
          title: "Vote Failed",
          description:
            "There was an error voting this cigarette vending machine.",
          variant: "error",
        },
        { timeout: 5000 },
      );
      return;
    }

    enqueue(
      {
        title: "Voted",
        description: "Thanks for your help!",
        variant: "success",
      },
      { timeout: 5000 },
    );
  }, []);

  const onDownvote = useCallback(async (id: string) => {
    try {
      await api.delete(`/cvm/${id}`);
    } catch (err: any) {
      enqueue(
        {
          title: "Vote Failed",
          description:
            "There was an error voting this cigarette vending machine.",
          variant: "error",
        },
        { timeout: 5000 },
      );
      return;
    }

    enqueue(
      {
        title: "Voted",
        description: "Thanks for your help!",
        variant: "success",
      },
      { timeout: 5000 },
    );
  }, []);

  return (
    <div className="flex h-0 grow flex-col">
      <CvmMap onReport={onReport} onUpvote={onUpvote} onDownvote={onDownvote} />
    </div>
  );
}
