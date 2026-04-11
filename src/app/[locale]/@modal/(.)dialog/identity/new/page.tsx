"use client";

import { useRouter } from "next/navigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { RequestIdentModalSheet } from "@/components/organisms/ident/RequestIdentModalSheet";
import { RequestIdentDialog } from "@/components/organisms/ident/RequestIdentDialog";

export default function Page() {
  const router = useRouter();
  const isSmDown = useBreakpointDown("sm");

  if (isSmDown) {
    return (
      <RequestIdentModalSheet
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
        <RequestIdentDialog />
      </AnimatedDialogModal>
    </>
  );
}
