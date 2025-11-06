"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { Link } from "../atoms/Link";
import { usePWAInstallPrompt } from "@/contexts/PWAInstallProvider";
import { AnimatedDialogModal } from "../molecules/AnimatedDialogModal";
import { IOSInstallInstructionsDialog } from "./IOSInstallInstructionsDialog";

export function InstallRequestNotificationHandler() {
  const t = useTranslations("Notifications.installRequest");
  const { enqueue } = useNotifications();

  const [
    isIOSInstallInstructionDialogOpen,
    setIsIOSInstallInstructionDialogOpen,
  ] = useState(false);

  const { isInstallable, promptInstall, isIOSInstallable } =
    usePWAInstallPrompt();

  const triggerInstall = useCallback(() => {
    if (isIOSInstallable) {
      setIsIOSInstallInstructionDialogOpen(true);
    } else if (isInstallable) {
      promptInstall().then((result) => {
        if (result) {
          window.location.reload();
        }
      });
    }
  }, [promptInstall, isInstallable, isIOSInstallable]);

  useEffect(() => {
    if (isInstallable || isIOSInstallable) {
      enqueue({
        title: t("title"),
        description: (
          <div className="flex gap-4">
            <div className="w-fit shrink-0">
              <div className="relative flex aspect-square w-fit items-center justify-center rounded-md bg-slate-200 px-1 dark:bg-slate-700">
                <Image
                  src="/images/logo.svg"
                  width={42}
                  height={32}
                  className="h-3"
                  alt="Kippenstummel"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div>{t("description")}</div>
              <Link onPress={triggerInstall}>{t("install")}</Link>
            </div>
          </div>
        ),
      });
    }
  }, [enqueue, t, isInstallable, isIOSInstallable, triggerInstall]);

  return (
    <AnimatedDialogModal
      isOpen={isIOSInstallInstructionDialogOpen}
      onOpenChange={setIsIOSInstallInstructionDialogOpen}
      className="max-w-xl"
    >
      <IOSInstallInstructionsDialog />
    </AnimatedDialogModal>
  );
}
