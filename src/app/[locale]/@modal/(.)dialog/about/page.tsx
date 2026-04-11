"use client";

import { useRouter } from "next/navigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { AboutModalSheet } from "@/components/organisms/navigation/AboutModalSheet";
import { AboutDialog } from "@/components/organisms/navigation/AboutDialog";

export default function Page() {
  const router = useRouter();
  const isSmDown = useBreakpointDown("sm");

  if (isSmDown) {
    return (
      <AboutModalSheet
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
        <AboutDialog />
      </AnimatedDialogModal>
    </>
  );
}
