import React from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";

import manifest from "@/../public/manifest.de.json";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AboutDialogProps extends Omit<DialogProps, "children"> {}

export function AboutDialog(props: AboutDialogProps) {
  const t = useTranslations("AboutDialog");
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
              <div className="text-sm">
                {t.rich("description", {
                  br: () => <br />,
                  ul: (chunks) => <ul className="list-disc">{chunks}</ul>,
                  li: (chunks) => <li className="ml-4">{chunks}</li>,
                  "license-link": (chunks) => (
                    <Link href="https://www.gnu.org/licenses/agpl-3.0.en.html">
                      {chunks}
                    </Link>
                  ),
                  "copyright-link": (chunks) => (
                    <Link href="https://github.com/MuellerConstantin">
                      {chunks}
                    </Link>
                  ),
                  "web-code-link": (chunks) => (
                    <Link href="https://github.com/MuellerConstantin/kippenstummel-web">
                      {chunks}
                    </Link>
                  ),
                  "api-code-link": (chunks) => (
                    <Link href="https://github.com/MuellerConstantin/kippenstummel-api">
                      {chunks}
                    </Link>
                  ),
                  "kmc-code-link": (chunks) => (
                    <Link href="https://github.com/MuellerConstantin/kippenstummel-kmc">
                      {chunks}
                    </Link>
                  ),
                  "privacy-link": (chunks) => (
                    <Link href="/privacy-policy">{chunks}</Link>
                  ),
                  "terms-link": (chunks) => (
                    <Link href="/terms-of-service">{chunks}</Link>
                  ),
                  version: manifest.version,
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
