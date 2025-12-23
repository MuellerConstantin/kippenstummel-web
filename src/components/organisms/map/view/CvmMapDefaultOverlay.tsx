import { AnimatePresence, motion } from "motion/react";
import { CvmInfoSidebar } from "../../cvm/CvmInfoSidebar";
import { CvmInfoModalSheet } from "../../cvm/CvmInfoModalSheet";
import { Cvm, CvmCluster } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";
import { FloatingMenuBottomNavigation } from "../../navigation/FloatingMenuBottomNavigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { HelpDialog } from "../../navigation/HelpDialog";
import { MapSettingsDialog } from "../../navigation/MapSettingsDialog";
import { CvmReportDialog } from "../../cvm/CvmReportDialog";
import { ClusterMarker } from "@/components/molecules/map/ClusterMarker";
import { LocationMarker } from "@/components/molecules/map/LocationMarker";
import { SelectedMarker } from "@/components/molecules/map/SelectedMarker";
import { useBreakpointUp } from "@/hooks/useBreakpointUp";
import { CvmInfoDialog } from "../../cvm/CvmInfoDialog";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { useCvmMapDefaultView } from "@/contexts/CvmMapViewContext";

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
  const isLgUp = useBreakpointUp("lg");
  const isSmDown = useBreakpointDown("sm");

  const {
    state,
    openHelpDialog,
    closeHelpDialog,
    openMapSettingsDialog,
    closeMapSettingsDialog,
    openReportDialog,
    closeReportDialog,
  } = useCvmMapDefaultView();

  return (
    <>
      {isSmDown && (
        <div className="pointer-events-none absolute flex h-full w-full">
          {selectedCvm && (
            <CvmInfoModalSheet
              isOpen={!!selectedCvm}
              onIsOpenChange={() => props.onDeselect?.()}
              {...props}
              cvm={selectedCvm!}
              onReport={openReportDialog}
            />
          )}
          <div className="relative grow">
            <div className="pointer-events-auto absolute bottom-14 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2 lg:hidden">
              <FloatingMenuBottomNavigation
                onHelp={openHelpDialog}
                onSettings={openMapSettingsDialog}
                onRegister={props.onRegister}
              />
            </div>
          </div>
        </div>
      )}
      {!isSmDown && !isLgUp && (
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
              onReport={openReportDialog}
            />
          </AnimatedDialogModal>
          <div className="relative grow">
            <div className="pointer-events-auto absolute bottom-9 left-1/2 z-[2000] block h-fit w-fit -translate-x-1/2 px-2">
              <FloatingMenuBottomNavigation
                onHelp={openHelpDialog}
                onSettings={openMapSettingsDialog}
                onRegister={props.onRegister}
              />
            </div>
          </div>
        </div>
      )}
      {isLgUp && (
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
                    onReport={openReportDialog}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative grow">
            <motion.div
              className="pointer-events-auto absolute bottom-8 left-1/2 z-[2000] h-fit w-fit -translate-x-1/2 px-2"
              layout
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FloatingMenuBottomNavigation
                onHelp={openHelpDialog}
                onSettings={openMapSettingsDialog}
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
        isOpen={state.showReportDialog}
        onOpenChange={closeReportDialog}
      >
        <CvmReportDialog
          onReport={(type) => {
            props.onReport?.(state.reporterPosition!, type);
            closeReportDialog();
          }}
        />
      </AnimatedDialogModal>
      <AnimatedDialogModal
        className="!max-w-2xl"
        isOpen={state.showHelpDialog}
        onOpenChange={closeHelpDialog}
      >
        <HelpDialog />
      </AnimatedDialogModal>
      <AnimatedDialogModal
        isOpen={state.showMapSettingsDialog}
        onOpenChange={closeMapSettingsDialog}
      >
        <MapSettingsDialog />
      </AnimatedDialogModal>
    </>
  );
}
