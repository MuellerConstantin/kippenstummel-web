import React from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { ChevronDown, ChevronUp, Equal } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HelpDialogProps extends Omit<DialogProps, "children"> {}

export function HelpDialog(props: HelpDialogProps) {
  const t = useTranslations("HelpDialog");

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
            <div className="space-y-2">
              <div className="font-semibold">{t("headlines.general")}</div>
              <div className="text-sm">
                {t.rich("description.general", {
                  br: () => <br />,
                })}
              </div>
              <div className="mt-4 grid grid-cols-[25px_1fr] gap-2 text-sm">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600">
                  <ChevronUp className="h-4 w-4 text-white" />
                </div>
                <div>{t("general.trusted")}</div>

                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-500">
                  <Equal className="h-4 w-4 text-white" />
                </div>
                <div>{t("general.approved")}</div>

                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
                  <ChevronDown className="h-4 w-4 text-white" />
                </div>
                <div>{t("general.unsteady")}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">{t("headlines.report")}</div>
              <div className="text-sm">
                {t.rich("description.report", {
                  br: () => <br />,
                })}
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">{t("headlines.vote")}</div>
              <div className="text-sm">
                {t.rich("description.vote", {
                  br: () => <br />,
                })}
              </div>
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
