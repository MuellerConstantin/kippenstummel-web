import Leaflet from "leaflet";
import { AnimatePresence } from "framer-motion";
import { Modal } from "@/components/atoms/Modal";
import useIsMobile from "@/hooks/useIsMobile";
import { CvmInfoSidebarDialog } from "./CvmInfoSidebarDialog";
import { CvmInfoMobileDialog } from "./CvmInfoMobileDialog";
import { CvmDto } from "@/lib/types/cvm";

interface CvmInfoDialogProps {
  cvm: CvmDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpvote?: (voterPosition: Leaflet.LatLng) => void;
  onDownvote?: (voterPosition: Leaflet.LatLng) => void;
  onReposition?: (editorPosition: Leaflet.LatLng) => void;
  onReport?: (reporterPosition: Leaflet.LatLng) => void;
}

export function CvmInfoDialog({
  cvm,
  open,
  onOpenChange,
  ...props
}: CvmInfoDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <Modal
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 200 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            isOpen={open}
            onOpenChange={onOpenChange}
            placement="bottom"
            isDismissable
          >
            <CvmInfoMobileDialog {...props} cvm={cvm} />
          </Modal>
        )}
      </AnimatePresence>
    );
  } else {
    return (
      <AnimatePresence>
        {open && (
          <CvmInfoSidebarDialog
            {...props}
            onClose={() => onOpenChange(false)}
            cvm={cvm}
          />
        )}
      </AnimatePresence>
    );
  }
}
