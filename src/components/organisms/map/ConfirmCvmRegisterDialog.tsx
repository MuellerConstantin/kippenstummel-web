import React from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { chain } from "react-aria";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";

interface ConfirmCvmRegisterDialogProps extends Omit<DialogProps, "children"> {
  onConfirm?: () => void;
}

export function ConfirmCvmRegisterDialog(props: ConfirmCvmRegisterDialogProps) {
  const t = useTranslations("ConfirmCvmReportDialog");

  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="my-0 text-xl leading-6 font-semibold"
          >
            {t("title")}
          </Heading>
          <div className="mt-4 flex flex-col gap-4">
            <div>{t("description")}</div>
            <div className="flex justify-start gap-4">
              <Button
                variant="secondary"
                onPress={() => close()}
                className="w-full"
              >
                {t("cancel")}
              </Button>
              <Button
                onPress={chain(close, props.onConfirm)}
                className="w-full"
              >
                {t("confirm")}
              </Button>
            </div>
            <div className="text-xs">
              {t.rich("disclaimer", {
                tos: (chunks) => <Link href="/terms-of-service">{chunks}</Link>,
                pp: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
              })}
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
