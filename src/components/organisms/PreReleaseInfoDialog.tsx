import React from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PreReleaseInfoDialogProps extends Omit<DialogProps, "children"> {}

export function PreReleaseInfoDialog(props: PreReleaseInfoDialogProps) {
  const t = useTranslations("PreReleaseInfoDialog");

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
            <div className="text-sm">
              {t.rich("description", {
                br: () => <br />,
                ul: (chunks) => <ul className="list-disc">{chunks}</ul>,
                li: (chunks) => <li className="ml-4">{chunks}</li>,
              })}
            </div>
            <div className="flex justify-start gap-4">
              <Button onPress={close} className="w-full">
                {t("close")}
              </Button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
