import { Button } from "@/components/atoms/Button";
import { Cvm } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";
import { CvmInfoDialogContent } from "./CvmInfoDialogContent";
import { X } from "lucide-react";

export interface CvmInfoSidebarProps {
  cvm: Cvm;
  onClose: () => void;
  onUpvote?: (voterPosition: GeoCoordinates) => void;
  onDownvote?: (voterPosition: GeoCoordinates) => void;
  onReposition?: (editorPosition: GeoCoordinates) => void;
  onReport?: (reporterPosition: GeoCoordinates) => void;
}

export function CvmInfoSidebar(props: CvmInfoSidebarProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto rounded-md bg-white/70 text-slate-900 shadow-lg backdrop-blur-md dark:bg-slate-900/60 dark:text-white dark:shadow-lg">
      <div className="relative h-full">
        <div className="absolute top-2 right-2">
          <Button variant="icon" onPress={props.onClose}>
            <X className="h-6 w-6 text-white dark:text-slate-400" />
          </Button>
        </div>
        <CvmInfoDialogContent {...props} withHeroImage />
      </div>
    </div>
  );
}
