"use client";

import { DialogProps } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { X as XIcon } from "lucide-react";
import { useAppSelector } from "@/store";
import { PrivacySettingsDialogContent } from "./PrivacySettingsDialogContent";

interface PrivacySettingsDialogProps extends Omit<DialogProps, "children"> {
  variant?: "simple" | "details";
}

export function PrivacySettingsDialog({
  variant,
  ...props
}: PrivacySettingsDialogProps) {
  // Until a choice was made the dialog acts as a consent gate and must not be
  // dismissable.
  const cookieSettingsSelected = useAppSelector(
    (state) => state.privacy.cookieSettingsSelected,
  );

  return (
    <Dialog {...props}>
      {({ close }) => (
        <div className="flex flex-col gap-4">
          {!!cookieSettingsSelected && (
            <div className="flex justify-end">
              <Button variant="icon" onPress={close}>
                <XIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
          )}
          <PrivacySettingsDialogContent variant={variant} onClose={close} />
        </div>
      )}
    </Dialog>
  );
}
