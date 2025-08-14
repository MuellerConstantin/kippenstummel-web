"use client";

import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "../atoms/Link";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import privacySlice from "@/store/slices/privacy";
import { Switch } from "@/components/atoms/Switch";
import { X as XIcon } from "lucide-react";

interface PrivacySettingsDialogProps extends Omit<DialogProps, "children"> {
  variant?: "simple" | "details";
}

export function PrivacySettingsDialog({
  variant = "simple",
  ...props
}: PrivacySettingsDialogProps) {
  const t = useTranslations("PrivacySettingsDialog");
  const dispatch = useAppDispatch();

  const cookieSettingsSelected = useAppSelector(
    (state) => state.privacy.cookieSettingsSelected,
  );
  const allowAnalyticsCookies = useAppSelector(
    (state) => state.privacy.allowAnalyticsCookies,
  );
  const allowPersonalizationCookies = useAppSelector(
    (state) => state.privacy.allowPersonalizationCookies,
  );
  const [mode, setMode] = useState<"details" | "simple">(variant);

  const [enablePersonalization, setEnablePersonalization] = useState(
    allowPersonalizationCookies,
  );
  const [enableAnalytics, setEnableAnalytics] = useState(allowAnalyticsCookies);

  const acceptAll = useCallback(
    (close: () => void) => {
      dispatch(privacySlice.actions.acceptAll());

      if (cookieSettingsSelected) {
        close();
      }
    },
    [dispatch, cookieSettingsSelected],
  );

  const declineAll = useCallback(
    (close: () => void) => {
      dispatch(privacySlice.actions.declineAll());

      if (cookieSettingsSelected) {
        close();
      }
    },
    [dispatch, cookieSettingsSelected],
  );

  const saveCustom = useCallback(
    (close: () => void) => {
      dispatch(
        privacySlice.actions.saveCustom({
          allowAnalyticsCookies: enableAnalytics,
          allowPersonalizationCookies: enablePersonalization,
        }),
      );

      if (cookieSettingsSelected) {
        close();
      }
    },
    [dispatch, enablePersonalization, enableAnalytics, cookieSettingsSelected],
  );

  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <div className="flex flex-col gap-4">
            {!!cookieSettingsSelected && (
              <div className="flex justify-end">
                <Button variant="icon" onPress={close}>
                  <XIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-center gap-6">
                <Image
                  src="/images/logo.svg"
                  width={32}
                  height={32}
                  alt="Logo"
                  className="h-12 w-12"
                />
                <h1 className="text-center text-2xl font-bold lg:text-3xl lg:text-4xl">
                  Kippenstummel
                </h1>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <Heading className="text-center text-lg font-semibold 2xl:text-xl">
                  {t("title")}
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t.rich("description", {
                    privacyHyperlink: (chunks) => (
                      <Link href="/privacy-policy">{chunks}</Link>
                    ),
                  })}
                </p>
              </div>
              {mode === "simple" && (
                <div className="flex flex-col gap-4">
                  <Button onPress={() => acceptAll(close)}>
                    {t("accept")}
                  </Button>
                  <div className="flex w-full gap-4">
                    <Button
                      onPress={() => declineAll(close)}
                      variant="secondary"
                      className="grow"
                    >
                      {t("decline")}
                    </Button>
                    <Button
                      onPress={() => setMode("details")}
                      variant="secondary"
                      className="grow"
                    >
                      {t("adapt")}
                    </Button>
                  </div>
                </div>
              )}
              {mode === "details" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 rounded-md border border-slate-300 p-2 text-xs dark:border-slate-600">
                    <div className="flex flex-col gap-2">
                      <h4 className="font-semibold">
                        {t("details.required.title")}
                      </h4>
                      <p>{t("details.required.description")}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Switch isDisabled isSelected={true}>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {t("enabled")}
                        </span>
                      </Switch>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-md border border-slate-300 p-2 text-xs dark:border-slate-600">
                    <div className="flex flex-col gap-2">
                      <h4 className="font-semibold">
                        {t("details.personalization.title")}
                      </h4>
                      <p>{t("details.personalization.description")}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Switch
                        isSelected={enablePersonalization}
                        onChange={setEnablePersonalization}
                      >
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {enablePersonalization ? t("enabled") : t("disabled")}
                        </span>
                      </Switch>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-md border border-slate-300 p-2 text-xs dark:border-slate-600">
                    <div className="flex flex-col gap-2">
                      <h4 className="font-semibold">
                        {t("details.analytics.title")}
                      </h4>
                      <p>{t("details.analytics.description")}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Switch
                        isSelected={enableAnalytics}
                        onChange={setEnableAnalytics}
                      >
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {enableAnalytics ? t("enabled") : t("disabled")}
                        </span>
                      </Switch>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-4">
                    <Button onPress={() => acceptAll(close)}>
                      {t("accept")}
                    </Button>
                    <Button
                      onPress={() => saveCustom(close)}
                      variant="secondary"
                    >
                      {t("save")}
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex w-full justify-start gap-2 text-xs">
                <Link href="/privacy-policy">{t("privacyPolicy")}</Link>
                <div>|</div>
                <Link href="/imprint">{t("imprint")}</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
