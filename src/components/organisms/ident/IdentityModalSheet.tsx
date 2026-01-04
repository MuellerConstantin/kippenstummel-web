import { useTranslations } from "next-intl";
import { ModalSheet } from "@/components/molecules/ModalSheet";
import { IdentityDialogContent } from "./IdentityDialogContent";

interface IdentityModalSheetProps {
  isOpen: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
}

export function IdentityModalSheet(props: IdentityModalSheetProps) {
  const t = useTranslations("IdentityDialog");

  return (
    <ModalSheet isOpen={props.isOpen} onIsOpenChange={props.onIsOpenChange}>
      <div className="flex h-[70vh] flex-col">
        <h4
          slot="title"
          className="my-0 shrink-0 text-xl leading-6 font-semibold"
        >
          {t("title")}
        </h4>
        <IdentityDialogContent />
      </div>
    </ModalSheet>
  );
}
