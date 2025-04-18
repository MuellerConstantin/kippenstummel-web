"use client";

import { useCallback, useState } from "react";
import Leaflet from "leaflet";
import { DialogTrigger } from "react-aria-components";
import { Modal } from "@/components/atoms/Modal";
import { CvmMap } from "@/components/organisms/map/CvmMap";
import { ConfirmIdentDialog } from "@/components/organisms/ident/ConfirmIdentDialog";

export default function Map() {
  const [showReportConfirmDialog, setShowReportConfirmDialog] = useState(false);

  const onReport = useCallback((position: Leaflet.LatLng) => {
    setShowReportConfirmDialog(true);
  }, []);

  return (
    <div className="flex h-0 grow flex-col">
      <CvmMap onReport={onReport} />
      <DialogTrigger
        isOpen={showReportConfirmDialog}
        onOpenChange={setShowReportConfirmDialog}
      >
        <Modal>
          <ConfirmIdentDialog />
        </Modal>
      </DialogTrigger>
    </div>
  );
}
