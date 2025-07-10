"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import useApi from "@/hooks/useApi";
import { decryptWithPassword } from "@/lib";
import { AxiosError } from "axios";
import { TextField } from "@/components/atoms/TextField";
import { Formik } from "formik";
import * as yup from "yup";
import { Form } from "@/components/atoms/Form";
import { Spinner } from "@/components/atoms/Spinner";
import identSlice from "@/store/slices/ident";
import { useNotifications } from "@/contexts/NotificationProvider";

export default function Tranfer() {
  const api = useApi();
  const t = useTranslations("TransferPage");
  const validationT = useTranslations("Validation");
  const notificationsT = useTranslations("Notifications");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { enqueue } = useNotifications();

  const schema = yup.object().shape({
    password: yup.string().required(validationT("required")),
  });

  const transferToken = searchParams.get("token");

  const hasFetched = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<{
    identity: string;
    encryptedSecret: string;
  } | null>(null);
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const hasIdentity = useAppSelector((state) => !!state.ident.identity);

  const importInfo = useCallback(
    (token: string) => {
      setIsLoading(true);
      setError(null);

      api
        .get<{
          identity: string;
          encryptedSecret: string;
        }>(`/ident/transfer/${token}`)
        .then((res) => setIdentity(res.data))
        .catch((err) => {
          if (err instanceof AxiosError) {
            if (err.response?.status === 404) {
              router.push("/not-found");
              return;
            }
          }

          setError(t("error"));
        })
        .finally(() => setIsLoading(false));
    },
    [api, router, t],
  );

  const onTransfer = useCallback(
    async ({ password }: { password: string }) => {
      setIsWrongPassword(false);

      try {
        const secret = await decryptWithPassword(
          identity!.encryptedSecret,
          password,
        );

        dispatch(
          identSlice.actions.setIdentity({
            identity: identity!.identity,
            secret,
          }),
        );

        enqueue(
          {
            title: notificationsT("identityTransfered.title"),
            description: notificationsT("identityTransfered.description"),
            variant: "success",
          },
          { timeout: 10000 },
        );

        router.replace("/");
      } catch {
        setIsWrongPassword(true);
      }
    },
    [identity, dispatch, router, enqueue, notificationsT],
  );

  useEffect(() => {
    if (!transferToken) {
      router.push("/not-found");
    } else if (!hasFetched.current) {
      hasFetched.current = true;
      importInfo(transferToken);
    }
  }, [transferToken, router, importInfo]);

  return (
    <div className="relative flex grow flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
      <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-sm" />
      <div className="relative z-20 flex w-full max-w-lg items-center justify-center rounded-lg bg-white/75 p-8 text-slate-700 shadow dark:bg-slate-700/90 dark:text-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <Image
                src="/images/logo.svg"
                width={32}
                height={32}
                alt="TaskCare Logo"
                className="h-12 w-12"
              />
              <h1 className="text-center text-2xl font-bold text-slate-500 lg:text-3xl lg:text-4xl dark:text-slate-400">
                Kippenstummel
              </h1>
            </div>
            <h3 className="text-center text-lg 2xl:text-2xl">
              {t("headline")}
            </h3>
          </div>
          <div className="space-y-4">
            <div className="text-sm">
              {hasIdentity
                ? t.rich("descriptionExisting", {
                    link: (chunks) => <Link href="/">{chunks}</Link>,
                    highlight: (chunks) => (
                      <span className="font-bold">{chunks}</span>
                    ),
                    br: () => <br />,
                  })
                : t.rich("descriptionEmpty", {
                    link: (chunks) => <Link href="/">{chunks}</Link>,
                    br: () => <br />,
                  })}
            </div>
            <div className="flex flex-col gap-2">
              {error && <p className="text-center text-red-500">{error}</p>}
              {isWrongPassword && (
                <p className="text-center text-red-500">{t("wrongPassword")}</p>
              )}
              <Formik<{ password: string }>
                initialValues={{ password: "" }}
                validationSchema={schema}
                onSubmit={(values) => onTransfer(values)}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit} validationBehavior="aria">
                    <TextField
                      label={t("form.transportPassword")}
                      isDisabled={isLoading}
                      name="password"
                      type="password"
                      value={props.values.password}
                      onBlur={props.handleBlur}
                      onChange={(value) =>
                        props.setFieldValue("password", value)
                      }
                      isInvalid={
                        !!props.touched.password && !!props.errors.password
                      }
                      errorMessage={props.errors.password}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        type="submit"
                        variant="secondary"
                        isDisabled={
                          !(props.isValid && props.dirty) || isLoading
                        }
                        className="flex w-full justify-center"
                      >
                        {!isLoading && <span>{t("form.submit")}</span>}
                        {isLoading && <Spinner />}
                      </Button>
                      <Link className="text-sm" href="/">
                        {t("form.cancel")}
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
