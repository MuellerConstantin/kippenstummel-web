import React from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Equal, MapPinPlus, X } from "lucide-react";

export function HelpDialogContent() {
  const t = useTranslations("HelpDialog");

  return (
    <div className="flex flex-col gap-4">
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
          <div>{t("general.r5p")}</div>

          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-500">
            <Equal className="h-4 w-4 text-white" />
          </div>
          <div>{t("general.r0P")}</div>

          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
          <div>{t("general.rN8p")}</div>

          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-800">
            <X className="h-4 w-4 text-white" />
          </div>
          <div>{t("general.rN10p")}</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-semibold">{t("headlines.identity")}</div>
        <div className="text-sm">
          {t.rich("description.identity", {
            br: () => <br />,
          })}
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-semibold">{t("headlines.karma")}</div>
        <div className="text-sm">
          {t.rich("description.karma", {
            br: () => <br />,
          })}
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-semibold">{t("headlines.register")}</div>
        <div className="text-sm">
          {t.rich("description.register", {
            br: () => <br />,
            interfaceIcon: () => (
              <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 align-middle">
                <MapPinPlus className="h-3 w-3 text-white" />
              </div>
            ),
          })}
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-semibold">{t("headlines.reposition")}</div>
        <div className="text-sm">
          {t.rich("description.reposition", {
            br: () => <br />,
          })}
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-semibold">{t("headlines.vote")}</div>
        <div className="text-sm">
          {t.rich("description.vote", {
            br: () => <br />,
            upIcon: () => (
              <div className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 align-middle dark:border-slate-600">
                <ChevronUp className="h-3 w-3 text-slate-600" />
              </div>
            ),
            downIcon: () => (
              <div className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 align-middle dark:border-slate-600">
                <ChevronDown className="h-3 w-3 text-slate-600" />
              </div>
            ),
          })}
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
    </div>
  );
}
