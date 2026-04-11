"use client";

import { useRouter } from "next/navigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { HelpModalSheet } from "@/components/organisms/navigation/HelpModalSheet";
import { HelpDialog } from "@/components/organisms/navigation/HelpDialog";

export default function Page() {
  const router = useRouter();
  const isSmDown = useBreakpointDown("sm");

  if (isSmDown) {
    return (
      <HelpModalSheet
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
        className="!max-w-4xl"
      >
        <HelpDialog />
      </AnimatedDialogModal>
    </>
  );
}
