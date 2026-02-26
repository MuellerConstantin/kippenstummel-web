import { useTranslations } from "next-intl";
import { chain } from "react-aria";
import { ModalSheet } from "@/components/molecules/ModalSheet";
import { RequestIdentDialogContent } from "./RequestIdentDialogContent";

interface RequestIdentModalSheetProps {
  isOpen: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function RequestIdentModalSheet(props: RequestIdentModalSheetProps) {
  const t = useTranslations("RequestIdentDialog");

  return (
    <ModalSheet isOpen={props.isOpen} onIsOpenChange={props.onIsOpenChange}>
      <div className="flex h-[70vh] flex-col gap-4">
        <h4
          slot="title"
          className="my-0 shrink-0 text-xl leading-6 font-semibold"
        >
          {t("title")}
        </h4>
        <RequestIdentDialogContent
          onConfirm={chain(
            () => props.onIsOpenChange?.(false),
            props.onConfirm,
          )}
          onCancel={chain(() => props.onIsOpenChange?.(false), props.onCancel)}
        />
      </div>
    </ModalSheet>
  );
}
