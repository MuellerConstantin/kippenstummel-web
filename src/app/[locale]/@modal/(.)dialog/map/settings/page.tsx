"use client";

import { useRouter } from "next/navigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { MapSettingsDialog } from "@/components/organisms/navigation/MapSettingsDialog";
import { MapSettingsModalSheet } from "@/components/organisms/navigation/MapSettingsModalSheet";

export default function Page() {
  const router = useRouter();
  const isSmDown = useBreakpointDown("sm");

  if (isSmDown) {
    return (
      <MapSettingsModalSheet
        isOpen
        onIsOpenChange={(open) => {
          if (!open) router.back();
        }}
      />
    );
  }

  return (
    <>
      <AnimatedDialogModal
        isOpen
        onOpenChange={(open) => {
          if (!open) router.back();
        }}
      >
        <MapSettingsDialog />
      </AnimatedDialogModal>
    </>
  );
}
