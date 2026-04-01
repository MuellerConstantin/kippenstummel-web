import { useTranslations } from "next-intl";
import { chain } from "react-aria";
import { ModalSheet } from "@/components/molecules/ModalSheet";
import { ImportIdentDialogContent } from "./ImportIdentDialogContent";

interface ImportIdentModalSheetProps {
  isOpen: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ImportIdentModalSheet(props: ImportIdentModalSheetProps) {
  const t = useTranslations("ImportIdentDialog");

  return (
    <ModalSheet isOpen={props.isOpen} onIsOpenChange={props.onIsOpenChange}>
      <div className="flex flex-col gap-4">
        <h4
          slot="title"
          className="my-0 shrink-0 text-xl leading-6 font-semibold"
        >
          {t("title")}
        </h4>
        <ImportIdentDialogContent
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
