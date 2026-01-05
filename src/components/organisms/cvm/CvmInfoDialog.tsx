import { Dialog } from "@/components/atoms/Dialog";
import { Cvm } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";
import { CvmInfoDialogContent } from "./CvmInfoDialogContent";
import { Button } from "@/components/atoms/Button";
import { X } from "lucide-react";

export interface CvmInfoMobileDialogProps {
  cvm: Cvm;
  onUpvote?: (voterPosition: GeoCoordinates) => void;
  onDownvote?: (voterPosition: GeoCoordinates) => void;
  onReposition?: (editorPosition: GeoCoordinates) => void;
  onReport?: (reporterPosition: GeoCoordinates) => void;
}

export function CvmInfoDialog(props: CvmInfoMobileDialogProps) {
  return (
    <Dialog className="!p-0">
      {({ close }) => (
        <div className="relative">
          <div className="absolute top-2 right-2">
            <Button variant="icon" onPress={close}>
              <X className="h-6 w-6 text-white dark:text-slate-400" />
            </Button>
          </div>
          <CvmInfoDialogContent {...props} withHeroImage />
        </div>
      )}
    </Dialog>
  );
}
