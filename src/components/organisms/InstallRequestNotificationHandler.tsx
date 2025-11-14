"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/contexts/NotificationProvider";
import { Link } from "../atoms/Link";
import { usePWAInstallPrompt } from "@/contexts/PWAInstallProvider";
import { AnimatedDialogModal } from "../molecules/AnimatedDialogModal";
import { IOSInstallInstructionsDialog } from "./IOSInstallInstructionsDialog";
import { useAppSelector, useAppDispatch } from "@/store";
import sessionSlice from "@/store/slices/session";

export function InstallRequestNotificationHandler() {
  const dispatch = useAppDispatch();
  const t = useTranslations("Notifications.installRequest");
  const { enqueue } = useNotifications();

  const visible = useAppSelector((state) => state.session.showInstallRequest);

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
    if (visible && (isInstallable || isIOSInstallable)) {
      const timer = setTimeout(() => {
        dispatch(sessionSlice.actions.setInstallRequestVisibility(false));

        enqueue({
          title: t("title"),
          description: ({ close }) => (
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
                <Link
                  onPress={() => {
                    triggerInstall();
                    close();
                  }}
                >
                  {t("install")}
                </Link>
              </div>
            </div>
          ),
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    enqueue,
    t,
    isInstallable,
    isIOSInstallable,
    triggerInstall,
    dispatch,
    visible,
  ]);

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
