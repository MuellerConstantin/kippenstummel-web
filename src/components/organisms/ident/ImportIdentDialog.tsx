import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { chain } from "react-aria";
import { Dialog } from "@/components/atoms/Dialog";
import { ImportIdentDialogContent } from "./ImportIdentDialogContent";

interface ImportIdentDialogProps extends Omit<DialogProps, "children"> {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ImportIdentDialog({
  onCancel,
  onConfirm,
  ...props
}: ImportIdentDialogProps) {
  const t = useTranslations("ImportIdentDialog");

  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="mb-4 text-xl leading-6 font-semibold"
          >
            {t("title")}
          </Heading>
          <ImportIdentDialogContent
            onConfirm={chain(close, onConfirm)}
            onCancel={chain(close, onCancel)}
          />
        </>
      )}
    </Dialog>
  );
}
