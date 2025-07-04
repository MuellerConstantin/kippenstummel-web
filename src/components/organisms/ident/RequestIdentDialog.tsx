import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AxiosError, AxiosResponse } from "axios";
import { DialogProps, Heading } from "react-aria-components";
import { chain } from "react-aria";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { TextField } from "@/components/atoms/TextField";
import { Spinner } from "@/components/atoms/Spinner";
import useApi from "@/hooks/useApi";
import { useAppDispatch } from "@/store";
import identSlice from "@/store/slices/ident";
import { solveChallenge } from "@/api/pow";

interface RequestIdentDialogProps extends Omit<DialogProps, "children"> {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function RequestIdentDialog(props: RequestIdentDialogProps) {
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
      >("/captcha");

      setCaptcha(captchaRes.data);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }, [t, api]);

  const onSubmit = useCallback(
    async (close: () => void) => {
      setSubmitError(null);
      setSubmitting(true);

      try {
        const powRes = await api.get("/pow");
        const pow = powRes.headers["x-pow"];

        const powSolution = await solveChallenge(pow);

        const identityRes = await api.get<{ identity: string; secret: string }>(
          "/ident",
          {
            headers: {
              "x-captcha": `${captcha!.id}:${captchaSolution}`,
              "x-pow": `${pow}:${powSolution}`,
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
          "/ident",
          {
            identity: identityRes.data.identity,
            secret: identityRes.data.secret,
          },
        );

        dispatch(identSlice.actions.setToken(tokenRes.data.token));

        chain(close, props.onConfirm)();
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
    },
    [captchaSolution, captcha, t, api, dispatch, props.onConfirm],
  );

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

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
            <div className="text-sm">{t("description")}</div>
            <div className="flex justify-center">
              {loading ? (
                <div>
                  <Spinner size={32} />
                </div>
              ) : error ? (
                <span className="text-red-500">{error || submitError}</span>
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
                  {submitError && (
                    <span className="text-red-500">{error || submitError}</span>
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
                onPress={() => onSubmit(close)}
                className="w-full"
                isDisabled={
                  loading || submitting || captchaSolution.length === 0
                }
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
                onPress={chain(close, props.onCancel)}
                variant="secondary"
                className="!cursor-pointer !text-xs"
              >
                {t("cancel")}
              </Link>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
