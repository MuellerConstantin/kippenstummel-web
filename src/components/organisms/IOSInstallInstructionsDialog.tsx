import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { X as XIcon } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IOSInstallInstructionsDialogProps
  extends Omit<DialogProps, "children"> {}

export function IOSInstallInstructionsDialog(
  props: IOSInstallInstructionsDialogProps,
) {
  const t = useTranslations("IOSInstallInstructionsDialog");

  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <div className="flex justify-between gap-4">
            <Heading
              slot="title"
              className="my-0 truncate text-xl leading-6 font-semibold"
            >
              {t("title")}
            </Heading>
            <div className="flex justify-end">
              <Button variant="icon" onPress={close}>
                <XIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 text-sm">
            {t("description")}
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <ol className="list-decimal space-y-2 pl-6 text-slate-800 dark:text-white">
              <li>
                {t.rich("steps.1", {
                  shareIcon: () => (
                    <svg
                      className="inline h-5 w-5 fill-slate-600 align-middle dark:fill-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                    </svg>
                  ),
                })}
              </li>
              <li>{t("steps.2")}</li>
              <li>{t("steps.3")}</li>
            </ol>
          </div>
        </>
      )}
    </Dialog>
  );
}
