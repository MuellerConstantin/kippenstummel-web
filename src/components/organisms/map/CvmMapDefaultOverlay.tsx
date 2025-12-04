import { AnimatePresence, motion } from "motion/react";
import useIsMobile from "@/hooks/useIsMobile";
import { CvmInfoSidebar } from "../cvm/CvmInfoSidebar";
import { CvmInfoDialog } from "../cvm/CvmInfoDialog";
import { Cvm, CvmCluster } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";
import { useCallback, useState } from "react";
import { MenuBottomNavigation } from "../navigation/MenuBottomNavigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { HelpDialog } from "../navigation/HelpDialog";
import { MapSettingsDialog } from "../navigation/MapSettingsDialog";
import { CvmReportDialog } from "../cvm/CvmReportDialog";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { SelectedMarker } from "@/components/molecules/map/SelectedMarker";

export interface CvmMapDefaultOverlayProps {
  selectedCvm: Cvm | null;
  markers: Cvm[];
  clusters: CvmCluster[];
  onSelect?: (cvmId: string) => void;
  onDeselect?: () => void;
  onRegister?: (position: GeoCoordinates) => void;
  onUpvote?: (voterPosition: GeoCoordinates) => void;
  onDownvote?: (voterPosition: GeoCoordinates) => void;
  onReposition?: (editorPosition: GeoCoordinates) => void;
  onReport?: (
    reporterPosition: GeoCoordinates,
    type: "missing" | "spam" | "inactive" | "inaccessible",
  ) => void;
}

export function CvmMapDefaultOverlay({
  selectedCvm,
  markers,
  clusters,
  ...props
}: CvmMapDefaultOverlayProps) {
  const isMobile = useIsMobile();

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showMapSettingsDialog, setShowMapSettingsDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reporterPosition, setReporterPosition] = useState<GeoCoordinates>();

  const onHelp = useCallback(() => {
    setShowHelpDialog(true);
  }, [setShowHelpDialog]);

  const onSettings = useCallback(() => {
    setShowMapSettingsDialog(true);
  }, [setShowMapSettingsDialog]);

  return (
    <>
      {isMobile && (
        <div className="pointer-events-none absolute flex h-full w-full">
          <AnimatedDialogModal
            isOpen={!!selectedCvm}
            onOpenChange={() => props.onDeselect?.()}
            placement="bottom"
            isDismissable
          >
            <CvmInfoDialog
              {...props}
              cvm={selectedCvm!}
              onReport={(reporterPosition) => {
                setShowReportDialog(true);
                setReporterPosition(reporterPosition);
              }}
            />
          </AnimatedDialogModal>
          <div className="relative grow">
            <div className="pointer-events-auto absolute bottom-9 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2 lg:hidden">
              <MenuBottomNavigation
                onHelp={onHelp}
                onSettings={onSettings}
                onRegister={props.onRegister}
              />
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="pointer-events-none absolute flex h-full w-full">
          <div className="pointer-events-auto z-[2000] h-full shrink-0 pt-3 pb-3 pl-3">
            <AnimatePresence>
              {!!selectedCvm && (
                <motion.div
                  className="h-full w-[25rem] cursor-default"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "25rem", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <CvmInfoSidebar
                    {...props}
                    onClose={() => props.onDeselect?.()}
                    cvm={selectedCvm}
                    onReport={(reporterPosition) => {
                      setShowReportDialog(true);
                      setReporterPosition(reporterPosition);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative grow">
            <motion.div
              className="pointer-events-auto absolute bottom-9 left-1/2 z-[2000] hidden h-fit w-fit -translate-x-1/2 px-2 lg:block xl:bottom-3"
              layout
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <MenuBottomNavigation
                onHelp={onHelp}
                onSettings={onSettings}
                onRegister={props.onRegister}
              />
            </motion.div>
          </div>
        </div>
      )}
      {markers
        ?.filter((marker) => marker.id !== selectedCvm?.id)
        .map((marker) => (
          <LocationMarker
            key={marker.id}
            cvm={marker}
            onSelect={() => props.onSelect?.(marker.id)}
          />
        ))}
      {clusters?.map((marker, index) => (
        <ClusterMarker
          key={index}
          position={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          count={marker.count}
        />
      ))}
      {!!selectedCvm && <SelectedMarker cvm={selectedCvm} />}
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
        isOpen={showMapSettingsDialog}
        onOpenChange={setShowMapSettingsDialog}
      >
        <MapSettingsDialog />
      </AnimatedDialogModal>
    </>
  );
}
