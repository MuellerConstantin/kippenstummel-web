import React from "react";
import { useTranslations } from "next-intl";
import { ModalSheet } from "@/components/molecules/ModalSheet";
import { HelpDialogContent } from "./HelpDialogContent";

interface HelpModalSheetProps {
  isOpen: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
}

export function HelpModalSheet(props: HelpModalSheetProps) {
  const t = useTranslations("HelpDialog");

  return (
    <ModalSheet isOpen={props.isOpen} onIsOpenChange={props.onIsOpenChange}>
      <div className="flex flex-col gap-4">
        <h4 slot="title" className="my-0 text-xl leading-6 font-semibold">
          {t("title")}
        </h4>
        <HelpDialogContent />
      </div>
    </ModalSheet>
  );
}
