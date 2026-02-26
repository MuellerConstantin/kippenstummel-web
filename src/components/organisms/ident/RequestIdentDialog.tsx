import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { chain } from "react-aria";
import { Dialog } from "@/components/atoms/Dialog";
import { RequestIdentDialogContent } from "./RequestIdentDialogContent";

interface RequestIdentDialogProps extends Omit<DialogProps, "children"> {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function RequestIdentDialog({
  onCancel,
  onConfirm,
  ...props
}: RequestIdentDialogProps) {
  const t = useTranslations("RequestIdentDialog");

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
          <RequestIdentDialogContent
            onConfirm={chain(close, onConfirm)}
            onCancel={chain(close, onCancel)}
          />
        </>
      )}
    </Dialog>
  );
}
