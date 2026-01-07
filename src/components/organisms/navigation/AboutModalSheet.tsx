import React from "react";
import { useTranslations } from "next-intl";
import { ModalSheet } from "@/components/molecules/ModalSheet";
import { AboutDialogContent } from "./AboutDialogContent";

interface AboutModalSheetProps {
  isOpen: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
}

export function AboutModalSheet(props: AboutModalSheetProps) {
  const t = useTranslations("AboutDialog");

  return (
    <ModalSheet isOpen={props.isOpen} onIsOpenChange={props.onIsOpenChange}>
      <div className="flex flex-col gap-4">
        <h4 slot="title" className="my-0 text-xl leading-6 font-semibold">
          {t("title")}
        </h4>
        <AboutDialogContent />
      </div>
    </ModalSheet>
  );
}
