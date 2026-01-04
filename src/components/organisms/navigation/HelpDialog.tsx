import React from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { HelpDialogContent } from "./HelpDialogContent";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HelpDialogProps extends Omit<DialogProps, "children"> {}

export function HelpDialog(props: HelpDialogProps) {
  const t = useTranslations("HelpDialog");

  return (
    <Dialog {...props}>
      {({ close }) => (
        <div className="flex flex-col gap-4">
          <Heading
            slot="title"
            className="my-0 text-xl leading-6 font-semibold"
          >
            {t("title")}
          </Heading>
          <HelpDialogContent />
          <div className="flex justify-start gap-4">
            <Button onPress={close} className="w-full">
              {t("close")}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
