"use client";

import { Heading } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "../atoms/Link";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import privacySlice from "@/store/slices/privacy";
import { Switch } from "@/components/atoms/Switch";

interface PrivacySettingsDialogContentProps {
  variant?: "simple" | "details";
  /** Invoked once the user made a choice, or dismissed the settings. */
  onClose: () => void;
}

export function PrivacySettingsDialogContent({
  variant = "simple",
  onClose,
}: PrivacySettingsDialogContentProps) {
  const t = useTranslations("PrivacySettingsDialog");
  const dispatch = useAppDispatch();

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

  const acceptAll = useCallback(() => {
    dispatch(privacySlice.actions.acceptAll());
    onClose();
  }, [dispatch, onClose]);

  const declineAll = useCallback(() => {
    dispatch(privacySlice.actions.declineAll());
    onClose();
  }, [dispatch, onClose]);

  const saveCustom = useCallback(() => {
    dispatch(
      privacySlice.actions.saveCustom({
        allowAnalyticsCookies: enableAnalytics,
        allowPersonalizationCookies: enablePersonalization,
      }),
    );
    onClose();
  }, [dispatch, enablePersonalization, enableAnalytics, onClose]);

  return (
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
          <Button onPress={acceptAll}>{t("accept")}</Button>
          <div className="flex w-full gap-4">
            <Button onPress={declineAll} variant="secondary" className="grow">
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
              <h4 className="font-semibold">{t("details.required.title")}</h4>
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
              <h4 className="font-semibold">{t("details.analytics.title")}</h4>
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
            <Button onPress={acceptAll}>{t("accept")}</Button>
            <Button onPress={saveCustom} variant="secondary">
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
  );
}
