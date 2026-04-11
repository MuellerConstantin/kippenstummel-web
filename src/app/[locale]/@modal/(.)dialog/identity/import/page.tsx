"use client";

import { useRouter } from "next/navigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { ImportIdentModalSheet } from "@/components/organisms/ident/ImportIdentModalSheet";
import { ImportIdentDialog } from "@/components/organisms/ident/ImportIdentDialog";

export default function Page() {
  const router = useRouter();
  const isSmDown = useBreakpointDown("sm");

  if (isSmDown) {
    return (
      <ImportIdentModalSheet
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
        <ImportIdentDialog />
      </AnimatedDialogModal>
    </>
  );
}
