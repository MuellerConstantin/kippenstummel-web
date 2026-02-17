import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { IdentityDialogContent } from "./IdentityDialogContent";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IdentityDialogProps extends Omit<DialogProps, "children"> {}

export function IdentityDialog(props: IdentityDialogProps) {
  const t = useTranslations("IdentityDialog");

  return (
    <Dialog {...props}>
      {({ close }) => (
        <div className="flex h-[70vh] flex-col gap-4">
          <Heading
            slot="title"
            className="my-0 shrink-0 text-xl leading-6 font-semibold"
          >
            {t("title")}
          </Heading>
          <IdentityDialogContent />
          <div className="flex w-full shrink-0 justify-end gap-4">
            <Button onPress={close} className="md:w-fit">
              {t("close")}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
