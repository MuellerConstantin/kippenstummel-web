import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AxiosError, AxiosResponse } from "axios";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { TextField } from "@/components/atoms/TextField";
import { Spinner } from "@/components/atoms/Spinner";
import useApi from "@/hooks/useApi";
import { useAppDispatch } from "@/store";
import identSlice from "@/store/slices/ident";

interface RequestIdentDialogContentProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  formerIdentityRejected?: boolean;
}

export function RequestIdentDialogContent({
  onCancel,
  onConfirm,
  formerIdentityRejected,
}: RequestIdentDialogContentProps) {
  const t = useTranslations("RequestIdentDialog");
  const dispatch = useAppDispatch();
  const api = useApi();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<
    { id: string; content: string } | undefined
  >(undefined);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [captchaSolution, setCaptchaSolution] = useState<string>("");

  const fetchCaptcha = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const captchaRes = await api.get<
        unknown,
        AxiosResponse<{ id: string; content: string }>
      >("/captcha", { params: { scope: "registration" } });

      setCaptcha(captchaRes.data);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }, [t, api]);

  const onSubmit = useCallback(async () => {
    setSubmitError(null);
    setSubmitting(true);

    try {
      const identityRes = await api.get<{ identity: string; secret: string }>(
        "/auth/register",
        {
          headers: {
            "x-captcha": `${captcha!.id}:${captchaSolution}`,
          },
        },
      );

      dispatch(
        identSlice.actions.setIdentity({
          identity: identityRes.data.identity,
          secret: identityRes.data.secret,
        }),
      );

      const tokenRes = await api.post<{ identity: string; token: string }>(
        "/auth/login",
        {
          identity: identityRes.data.identity,
          secret: identityRes.data.secret,
        },
      );

      dispatch(identSlice.actions.setToken(tokenRes.data.token));

      onConfirm?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.response?.status === 403 &&
          err.response.data.code === "INVALID_CAPTCHA_STAMP_ERROR"
        ) {
          setSubmitError(t("wrongSolution"));
        } else {
          setSubmitError(t("error"));
        }
      } else {
        setSubmitError(t("error"));
      }

      dispatch(identSlice.actions.clearIdentity());
    } finally {
      setSubmitting(false);
    }
  }, [captchaSolution, captcha, t, api, dispatch, onConfirm]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  return (
    <div className="flex flex-col gap-4">
      {formerIdentityRejected && (
        <div className="text-center text-sm text-amber-500">
          {t("formerIdentityRejected")}
        </div>
      )}
      <div className="text-sm">{t("description")}</div>
      <div className="flex justify-center">
        {loading ? (
          <div className="h-32 w-[80%] animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
        ) : error || submitError ? (
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <div className="h-32 w-[80%] rounded-md bg-red-300 dark:bg-red-800" />
            <span className="text-red-500">{error || submitError}</span>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-2">
            {captcha && (
              <div className="relative h-32 w-[80%]">
                <Image
                  src={captcha?.content || ""}
                  alt="Captcha"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex justify-center">
              <Link
                onPress={fetchCaptcha}
                variant="secondary"
                className="!cursor-pointer !text-xs"
              >
                {t("reload")}
              </Link>
            </div>
            {submitError && (
              <span className="text-sm text-red-500">
                {error || submitError}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <TextField
          placeholder={t("captchaPlaceholder")}
          value={captchaSolution}
          onChange={setCaptchaSolution}
          isDisabled={loading || submitting}
        />
        <Button
          onPress={() => onSubmit()}
          className="w-full"
          isDisabled={loading || submitting || captchaSolution.length === 0}
        >
          <div className="flex justify-center">
            {submitting ? <Spinner /> : t("confirm")}
          </div>
        </Button>
      </div>
      <div className="text-xs">
        {t.rich("disclaimer", {
          tos: (chunks) => <Link href="/terms-of-service">{chunks}</Link>,
          pp: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
        })}
      </div>
      <div className="flex justify-center">
        <Link
          onPress={onCancel}
          variant="secondary"
          className="!cursor-pointer !text-xs"
        >
          {t("cancel")}
        </Link>
      </div>
    </div>
  );
}
