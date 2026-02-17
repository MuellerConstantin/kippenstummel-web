import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik } from "formik";
import * as yup from "yup";
import { ReactQRCode } from "@lglab/react-qr-code";
import { Button } from "@/components/atoms/Button";
import { useAppSelector } from "@/store";
import { Check, Copy } from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { TextField } from "@/components/atoms/TextField";
import { Form } from "@/components/atoms/Form";
import { Spinner } from "@/components/atoms/Spinner";
import { encryptWithPassword } from "@/lib/encrypt";
import useApi from "@/hooks/useApi";
import { AxiosResponse } from "axios";
import Image from "next/image";

interface CopyButtonProps {
  text: string;
  className?: string;
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
    <Button variant="icon" onPress={handleClick} className={props.className}>
      <div className="transition-all duration-300 ease-in-out">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </div>
    </Button>
  );
}

export function TransferIdentitySection() {
  const api = useApi();

  const t = useTranslations("IdentityDialog.transfer");
  const validationT = useTranslations("Validation");

  const identity = useAppSelector((state) => state.ident.identity);
  const secret = useAppSelector((state) => state.ident.secret);

  const schema = yup.object().shape({
    password: yup.string().required(validationT("required")),
    captchaSolution: yup.string().required(validationT("required")),
  });

  const [hasRequestedTransfer, setHasRequestedTransfer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<
    { id: string; content: string } | undefined
  >(undefined);

  const fetchCaptcha = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const captchaRes = await api.get<
        unknown,
        AxiosResponse<{ id: string; content: string }>
      >("/captcha", { params: { scope: "transfer" } });

      setCaptcha(captchaRes.data);
    } catch {
      setError(t("form.error"));
    } finally {
      setIsLoading(false);
    }
  }, [t, api]);

  const onTransfer = useCallback(
    async ({
      password,
      captchaSolution,
    }: {
      password: string;
      captchaSolution: string;
    }) => {
      setSubmitting(true);
      setSubmitError(null);
      setToken(null);

      const encrypted = await encryptWithPassword(secret!, password);

      try {
        const res = await api.post<{ identity: string; token: string }>(
          "/ident/transfer",
          {
            identity,
            encryptedSecret: encrypted,
          },
          {
            headers: {
              "x-captcha": `${captcha!.id}:${captchaSolution}`,
            },
          },
        );

        setToken(res.data.token);
      } catch {
        setSubmitError(t("form.error"));
      } finally {
        setSubmitting(false);
      }
    },
    [secret, identity, api, t, captcha],
  );

  useEffect(() => {
    if (hasRequestedTransfer) {
      fetchCaptcha();
    }
  }, [fetchCaptcha, hasRequestedTransfer]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm">
        {t.rich("description", {
          link: (chunks) => <Link href="/terms-of-service">{chunks}</Link>,
        })}
      </div>
      {!hasRequestedTransfer ? (
        <div>
          <Button
            variant="secondary"
            className="flex w-fit justify-center"
            onPress={() => setHasRequestedTransfer(true)}
          >
            <span>{t("beginTransfer")}</span>
          </Button>
        </div>
      ) : !token ? (
        <>
          <div className="text-sm">{t("form.description")}</div>
          <div className="flex flex-col gap-2">
            {(error || submitError) && (
              <p className="text-center text-sm text-red-500">
                {error || submitError}
              </p>
            )}
            <div className="flex justify-center">
              {isLoading ? (
                <div>
                  <Spinner size={32} />
                </div>
              ) : (
                !error && (
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
                        {t("form.reloadCaptcha")}
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
            <Formik<{ password: string; captchaSolution: string }>
              initialValues={{ password: "", captchaSolution: "" }}
              validationSchema={schema}
              onSubmit={(values) => onTransfer(values)}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit} validationBehavior="aria">
                  <TextField
                    label={t("form.captcha")}
                    name="captchaSolution"
                    value={props.values.captchaSolution}
                    onBlur={props.handleBlur}
                    isDisabled={isLoading || submitting}
                    onChange={(value) =>
                      props.setFieldValue("captchaSolution", value)
                    }
                    isInvalid={
                      !!props.touched.captchaSolution &&
                      !!props.errors.captchaSolution
                    }
                    errorMessage={props.errors.captchaSolution}
                  />
                  <TextField
                    label={t("form.transportPassword")}
                    name="password"
                    type="password"
                    value={props.values.password}
                    onBlur={props.handleBlur}
                    isDisabled={isLoading || submitting}
                    onChange={(value) => props.setFieldValue("password", value)}
                    isInvalid={
                      !!props.touched.password && !!props.errors.password
                    }
                    errorMessage={props.errors.password}
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="flex w-fit justify-center"
                    isDisabled={
                      !(props.isValid && props.dirty) || submitting || isLoading
                    }
                  >
                    {!submitting && <span>{t("form.submit")}</span>}
                    {submitting && <Spinner />}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="text-sm font-semibold">{t("share")}</div>
          <div className="flex gap-2">
            <TextField
              className="grow"
              isReadOnly
              value={`${window.location.protocol}//${window.location.host}/transfer?token=${token}`}
            />
            <CopyButton
              text={`${window.location.protocol}//${window.location.host}/transfer?token=${token}`}
              disabled={isLoading}
            />
          </div>
          <div className="flex w-full flex-col items-center gap-8 md:flex-row md:justify-start">
            <div className="flex aspect-square h-[192px] shrink-0 justify-center overflow-hidden rounded-3xl border border-slate-400">
              <ReactQRCode
                value={`${window.location.protocol}//${window.location.host}/transfer?token=${token}`}
                size={192}
                background="#ffffff"
                imageSettings={{
                  src: "/images/logo.svg",
                  width: 48,
                  height: 19,
                  excavate: true,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
