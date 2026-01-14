import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/components/atoms/Link";

import manifest from "@/../public/manifest.de.json";
import { useEnv } from "@/contexts/RuntimeConfigProvider";
import Image from "next/image";

export function AboutDialogContent() {
  const t = useTranslations("AboutDialog");

  const isPreRelease = useEnv("NEXT_PUBLIC_IS_PRE_RELEASE") === "true";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-sm">
        <div>Kippenstummel</div>
        <div>Version {manifest.version}</div>
        {isPreRelease && (
          <div className="flex">
            <div className="rounded-md bg-slate-600 px-1 py-0.5 text-xs text-white">
              Pre-Release
            </div>
          </div>
        )}
        <div>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="https://github.com/MuellerConstantin">
            Constantin Müller
          </Link>
        </div>
      </div>
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
        })}
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <h4 className="font-semibold">{t("thirdParty.title")}</h4>
        <div>{t("thirdParty.description")}</div>
        <div className="flex w-fit items-center gap-4 rounded-md border border-slate-400 p-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden">
            <Image
              src="/images/third-party/openstreetmap.png"
              alt="OpenStreetMap"
              fill
              objectFit="contain"
              layout="fill"
            />
          </div>
          <div className="flex grow flex-col gap-1">
            <h5 className="font-semibold">OpenStreetMap</h5>
            <Link href="https://www.openstreetmap.org" target="_blank">
              https://www.openstreetmap.org
            </Link>
          </div>
        </div>
        <div className="flex w-fit items-center gap-4 rounded-md border border-slate-400 p-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden">
            <Image
              src="/images/third-party/openfreemap.jpg"
              alt="OpenFreeMap"
              fill
              objectFit="contain"
              layout="fill"
            />
          </div>
          <div className="flex grow flex-col gap-1">
            <h5 className="font-semibold">OpenFreeMap</h5>
            <Link href="https://openfreemap.org" target="_blank">
              https://openfreemap.org
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
