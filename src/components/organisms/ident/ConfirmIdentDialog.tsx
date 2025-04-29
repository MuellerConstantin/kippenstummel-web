import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AxiosResponse } from "axios";
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
import { getFingerprintData } from "@/api/fingerprint";

interface ConfirmIdentDialogProps extends Omit<DialogProps, "children"> {
  onConfirm?: () => void;
}

export function ConfirmIdentDialog(props: ConfirmIdentDialogProps) {
  const t = useTranslations("ConfirmIdentDialog");
  const dispatch = useAppDispatch();
  const api = useApi();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<
    { id: string; content: string } | undefined
  >(undefined);
  const [pow, setPow] = useState<string | undefined>();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [captchaSolution, setCaptchaSolution] = useState<string>("");

  const fetchCaptchaAndPow = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const captchaRes = await api.get<
        unknown,
        AxiosResponse<{ id: string; content: string }>
      >("/captcha");

      const powRes = await api.get("/pow");

      setCaptcha(captchaRes.data);
      setPow(powRes.headers["x-pow"]);
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
        const powSolution = await solveChallenge(pow!);
        const fingerprint = await getFingerprintData();

        const res = await api.post("/ident", fingerprint, {
          headers: {
            "x-captcha": `${captcha!.id}:${captchaSolution}`,
            "x-pow": `${pow}:${powSolution}`,
          },
        });

        dispatch(
          identSlice.actions.setIdentity({
            identity: res.data.identity,
            token: res.data.token,
          }),
        );
        chain(close, props.onConfirm)();
      } catch {
        setSubmitError(t("error"));
      } finally {
        setSubmitting(false);
      }
    },
    [captchaSolution, captcha, pow, t, api, dispatch, props.onConfirm],
  );

  useEffect(() => {
    fetchCaptchaAndPow();
  }, [fetchCaptchaAndPow]);

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
            <div>{t("description")}</div>
            <div className="flex justify-center">
              {loading ? (
                <div>
                  <Spinner size={32} />
                </div>
              ) : error || submitError ? (
                <span className="text-red-500">{error || submitError}</span>
              ) : (
                <>
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
                </>
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
          </div>
        </>
      )}
    </Dialog>
  );
}
