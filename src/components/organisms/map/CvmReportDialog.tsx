import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog";
import { Heading } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { Radio, RadioGroup } from "@/components/atoms/RadioGroup";

interface CvmReportDialogProps {
  onReport?: (type: "missing" | "spam" | "inactive" | "inaccessible") => void;
}

export function CvmReportDialog(props: CvmReportDialogProps) {
  const t = useTranslations("CvmReportDialog");
  const { onReport } = props;

  const [selected, setSelected] = useState<string | null>(null);

  const onSubmit = useCallback(
    (close: () => void) => {
      if (!selected) return;
      onReport?.(selected as "missing" | "spam" | "inactive" | "inaccessible");
      close();
    },
    [onReport, selected],
  );

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="my-0 text-xl leading-6 font-semibold"
          >
            {t("title")}
          </Heading>
          <div className="mt-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div>{t("description")}</div>
              <RadioGroup
                value={selected}
                onChange={(value) => setSelected(value)}
              >
                <Radio value="missing">{t("reasons.missing")}</Radio>
                <Radio value="spam">{t("reasons.spam")}</Radio>
                <Radio value="inactive">{t("reasons.inactive")}</Radio>
                <Radio value="inaccessible">{t("reasons.inaccessible")}</Radio>
              </RadioGroup>
            </div>
            <div className="flex flex-col justify-start gap-4">
              <Button
                onPress={() => onSubmit(close)}
                className="w-full"
                isDisabled={!selected}
              >
                {t("submit")}
              </Button>
              <div className="flex justify-center">
                <Link
                  onPress={close}
                  variant="secondary"
                  className="!cursor-pointer !text-xs"
                >
                  {t("cancel")}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
