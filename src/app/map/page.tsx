"use client";

import { useCallback, useState } from "react";
import Leaflet from "leaflet";
import { DialogTrigger } from "react-aria-components";
import { Modal } from "@/components/atoms/Modal";
import { CvmMap } from "@/components/organisms/map/CvmMap";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useAppSelector } from "@/store";
import { ConfirmIdentDialog } from "@/components/organisms/ident/ConfirmIdentDialog";
import useApi from "@/hooks/useApi";

export default function Map() {
  const api = useApi();
  const token = useAppSelector((state) => state.ident.token);
  const { enqueue } = useNotifications();

  const [showReportConfirmDialog, setShowReportConfirmDialog] = useState(false);
  const [outstandingPosition, setOutstandingPosition] = useState<
    Leaflet.LatLng | undefined
  >(undefined);

  const onReport = useCallback(
    async (position: Leaflet.LatLng) => {
      try {
        await api.post("/cvm", {
          latitude: position.lat,
          longitude: position.lng,
        });
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          setShowReportConfirmDialog(true);
          setOutstandingPosition(position);
          return;
        }

        enqueue({
          title: "Report Failed",
          description: "There was an error submitting your report.",
          variant: "error",
        });
        return;
      }

      enqueue({
        title: "Reported",
        description: "Your report has been sent. Thanks for your help!",
        variant: "success",
      });
    },
    [token],
  );

  const onConfirm = useCallback(async () => {
    if (outstandingPosition) {
      try {
        await api.post("/cvm", {
          latitude: outstandingPosition.lat,
          longitude: outstandingPosition.lng,
        });
      } catch (err: any) {
        enqueue({
          title: "Report Failed",
          description: "There was an error submitting your report.",
          variant: "error",
        });
        return;
      }

      enqueue({
        title: "Reported",
        description: "Your report has been sent. Thanks for your help!",
        variant: "success",
      });
    }
  }, [enqueue, outstandingPosition]);

  return (
    <div className="flex h-0 grow flex-col">
      <CvmMap onReport={onReport} />
      <DialogTrigger
        isOpen={showReportConfirmDialog}
        onOpenChange={setShowReportConfirmDialog}
      >
        <Modal>
          <ConfirmIdentDialog onConfirm={onConfirm} />
        </Modal>
      </DialogTrigger>
    </div>
  );
}
