import { Cvm } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";
import { ModalSheet } from "@/components/molecules/ModalSheet";
import { CvmInfoDialogContent } from "./CvmInfoDialogContent";

export interface CvmInfoModalSheetProps {
  cvm: Cvm;
  isOpen: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
  onUpvote?: (voterPosition: GeoCoordinates) => void;
  onDownvote?: (voterPosition: GeoCoordinates) => void;
  onReposition?: (editorPosition: GeoCoordinates) => void;
  onReport?: (reporterPosition: GeoCoordinates) => void;
}

export function CvmInfoModalSheet(props: CvmInfoModalSheetProps) {
  return (
    <ModalSheet isOpen={props.isOpen} onIsOpenChange={props.onIsOpenChange}>
      <CvmInfoDialogContent {...props} />
    </ModalSheet>
  );
}
