"use client";

import { useRouter } from "next/navigation";
import { AnimatedDialogModal } from "@/components/molecules/AnimatedDialogModal";
import { PrivacySettingsDialog } from "@/components/organisms/PrivacySettingsDialog";

export default function Page() {
  const router = useRouter();

  return (
    <AnimatedDialogModal
      isOpen
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      className="max-w-xl"
    >
      <PrivacySettingsDialog variant="details" />
    </AnimatedDialogModal>
  );
}
