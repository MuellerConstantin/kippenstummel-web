import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "@/components/atoms/Modal";
import useIsMobile from "@/hooks/useIsMobile";
import { CvmInfoSidebar } from "../cvm/CvmInfoSidebar";
import { CvmInfoDialog } from "../cvm/CvmInfoDialog";
import { Cvm } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";
import { useCallback, useRef, useState } from "react";
import { useElementWidth } from "@/hooks/useElementWidth";
import { MenuBottomNavigation } from "../navigation/MenuBottomNavigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { HelpDialog } from "../navigation/HelpDialog";
import { FilterDialog } from "../navigation/FilterDialog";
import { CvmReportDialog } from "../cvm/CvmReportDialog";

interface CvmInfoDialogProps {
  cvm: Cvm;
  open: boolean;
  onRegister?: (position: GeoCoordinates) => void;
  onOpenChange: (open: boolean) => void;
  onUpvote?: (voterPosition: GeoCoordinates) => void;
  onDownvote?: (voterPosition: GeoCoordinates) => void;
  onReposition?: (editorPosition: GeoCoordinates) => void;
  onReport?: (
    reporterPosition: GeoCoordinates,
    type: "missing" | "spam" | "inactive" | "inaccessible",
  ) => void;
}

export function CvmMapDefaultOverlay({
  cvm,
  open,
  onOpenChange,
  ...props
}: CvmInfoDialogProps) {
  const isMobile = useIsMobile();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarWidth = useElementWidth(sidebarRef);

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reporterPosition, setReporterPosition] = useState<GeoCoordinates>();

  const onHelp = useCallback(() => {
    setShowHelpDialog(true);
  }, [setShowHelpDialog]);

  const onFilter = useCallback(() => {
    setShowFilterDialog(true);
  }, [setShowFilterDialog]);

  return (
    <>
      {isMobile && (
        <div className="pointer-events-none absolute flex h-full w-full">
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
                <CvmInfoDialog
                  {...props}
                  cvm={cvm}
                  onReport={(reporterPosition) => {
                    setShowReportDialog(true);
                    setReporterPosition(reporterPosition);
                  }}
                />
              </Modal>
            )}
          </AnimatePresence>
          <div className="relative grow">
            <div className="menu-bottom-navigation-wrapper pointer-events-auto fixed bottom-9 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2 lg:hidden">
              <MenuBottomNavigation
                onHelp={onHelp}
                onFilter={onFilter}
                onRegister={props.onRegister}
              />
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="pointer-events-none absolute flex h-full w-full">
          <div
            ref={sidebarRef}
            className="pointer-events-auto z-[2000] h-full shrink-0 pt-3 pb-3 pl-3"
          >
            <AnimatePresence>
              {open && (
                <CvmInfoSidebar
                  {...props}
                  onClose={() => onOpenChange(false)}
                  cvm={cvm}
                  onReport={(reporterPosition) => {
                    setShowReportDialog(true);
                    setReporterPosition(reporterPosition);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="relative grow">
            <motion.div
              className="menu-bottom-navigation-wrapper pointer-events-auto fixed bottom-9 left-1/2 z-[2000] hidden h-fit w-fit -translate-x-1/2 px-2 lg:block"
              animate={{ x: open ? sidebarWidth / 2 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <MenuBottomNavigation
                onHelp={onHelp}
                onFilter={onFilter}
                onRegister={props.onRegister}
              />
            </motion.div>
          </div>
        </div>
      )}
      <AnimatedDialogModal
        isOpen={showReportDialog}
        onOpenChange={setShowReportDialog}
      >
        <CvmReportDialog
          onReport={(type) => {
            props.onReport?.(reporterPosition!, type);
            setShowReportDialog(false);
          }}
        />
      </AnimatedDialogModal>
      <AnimatedDialogModal
        className="!max-w-2xl"
        isOpen={showHelpDialog}
        onOpenChange={setShowHelpDialog}
      >
        <HelpDialog />
      </AnimatedDialogModal>
      <AnimatedDialogModal
        isOpen={showFilterDialog}
        onOpenChange={setShowFilterDialog}
      >
        <FilterDialog />
      </AnimatedDialogModal>
    </>
  );
}
