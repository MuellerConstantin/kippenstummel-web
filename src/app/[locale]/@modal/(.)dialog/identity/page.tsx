"use client";

import { useRouter } from "next/navigation";
import { IdentityDialog } from "@/components/organisms/ident/IdentityDialog";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { IdentityModalSheet } from "@/components/organisms/ident/IdentityModalSheet";

export default function Page() {
  const router = useRouter();
  const isSmDown = useBreakpointDown("sm");

  if (isSmDown) {
    return (
      <IdentityModalSheet
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
        <IdentityDialog />
      </AnimatedDialogModal>
    </>
  );
}
