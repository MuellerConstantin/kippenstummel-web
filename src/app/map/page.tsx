"use client";

import { useCallback, useState } from "react";
import Leaflet from "leaflet";
import { DialogTrigger } from "react-aria-components";
import { Modal } from "@/components/atoms/Modal";
import { CvmMap } from "@/components/organisms/map/CvmMap";
import { useNotifications } from "@/contexts/NotificationProvider";
import { useAppSelector } from "@/store";
import { ConfirmIdentDialog } from "@/components/organisms/ident/ConfirmIdentDialog";

export default function Map() {
  const token = useAppSelector((state) => state.ident.token);
  const { enqueue } = useNotifications();

  const [showReportConfirmDialog, setShowReportConfirmDialog] = useState(false);
  const [outstandingPosition, setOutstandingPosition] = useState<
    Leaflet.LatLng | undefined
  >(undefined);

  const reportPosition = useCallback(
    async (position: Leaflet.LatLng) => {
      enqueue({
        title: "Reported",
        description: "Your report has been sent. Thanks for your help!",
        variant: "success",
      });
    },
    [token],
  );

  const onReport = useCallback(
    async (position: Leaflet.LatLng) => {
      if (!token) {
        setOutstandingPosition(position);
        setShowReportConfirmDialog(true);
        return;
      }

      await reportPosition(position);
    },
    [token, reportPosition],
  );

  const onConfirm = useCallback(async () => {
    if (outstandingPosition) {
      await reportPosition(outstandingPosition);
    }
  }, [enqueue, outstandingPosition, reportPosition]);

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
