import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { IdentIcon } from "@/components/atoms/IdentIcon";
import { useAppSelector } from "@/store";
import { Check, Copy, Info } from "lucide-react";
import { Link } from "../atoms/Link";

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
}

function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(props.text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [props.text]);

  return (
    <button
      className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed"
      disabled={props.disabled}
      onClick={handleClick}
    >
      <div className="transition-all duration-300 ease-in-out">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </div>
    </button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IdentityDialogProps extends Omit<DialogProps, "children"> {}

export function IdentityDialog(props: IdentityDialogProps) {
  const t = useTranslations("IdentityDialog");

  const identity = useAppSelector((state) => state.ident.identity);

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
          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="h-32 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
              <IdentIcon value={identity || ""} />
            </div>
            <div className="brorder-slate-200 w-full space-y-2 rounded-md border p-4 dark:border-slate-600">
              <div className="font-semibold">{t("uniqueId")}</div>
              <div className="flex items-center gap-2">
                <div className="text-xs">{identity || "Anonymous"}</div>
                <CopyButton text={identity || ""} disabled={!identity} />
              </div>
            </div>
            <div className="flex w-full gap-2">
              <Info className="h-4 w-4 shrink-0 text-green-600" />
              <p className="text-xs">
                {t.rich("info", {
                  link1: (chunks) => (
                    <Link href="/terms-of-service">{chunks}</Link>
                  ),
                  link2: (chunks) => (
                    <Link href="/privacy-policy">{chunks}</Link>
                  ),
                })}
              </p>
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
