import React, { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Button } from "@/components/atoms/Button";
import { IdentIcon } from "@/components/atoms/IdentIcon";
import { Checkbox } from "@/components/atoms/Checkbox";
import { useAppDispatch, useAppSelector } from "@/store";
import { Check, Copy, ChevronUp, ChevronDown } from "lucide-react";
import { TextField } from "@/components/atoms/TextField";
import { Form } from "@/components/atoms/Form";
import { Spinner } from "@/components/atoms/Spinner";
import useApi from "@/hooks/useApi";
import identSlice from "@/store/slices/ident";
import { IdentInfo } from "@/lib/types/ident";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/types/error";
import useSWR from "swr";

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

function DisplayNameInput() {
  const t = useTranslations("IdentityDialog.profile");
  const validationT = useTranslations("Validation");
  const api = useApi();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const schema = yup.object().shape({
    currentUsername: yup
      .string()
      .required(validationT("required"))
      .matches(
        /^[A-Za-z](?:[A-Za-z0-9_-]{2,14}[A-Za-z0-9])$/,
        validationT("invalidUsername"),
      ),
  });

  const { data, mutate } = useSWR<IdentInfo, AxiosError<ApiError>, string>(
    "/ident/me",
    (url) => api.get(url).then((res) => res.data),
  );

  const [username, suffix] = useMemo(() => {
    if (!data?.displayName) return ["", ""];
    return data.displayName.split("#");
  }, [data]);

  const changeUsername = useCallback(
    async (
      { currentUsername }: { currentUsername: string },
      formikHelpers: FormikHelpers<{ currentUsername: string }>,
    ) => {
      setGlobalError(null);

      try {
        await api.patch("/ident/me", {
          username: currentUsername === "" ? null : currentUsername,
        });
        await mutate();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 409 &&
            error.response.data.code === "USERNAME_ALREADY_EXISTS_ERROR"
          ) {
            formikHelpers.setFieldError(
              "currentUsername",
              t("usernameAlreadyInUse"),
            );
            return;
          } else if (
            error.response?.status === 422 &&
            error.response.data.code === "INVALID_PAYLOAD_ERROR"
          ) {
            const isForbiddenUsername = error.response.data.details?.some(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (detail: any) =>
                detail.property === "username" &&
                detail.constraint === "isCleanUsername",
            );

            if (isForbiddenUsername) {
              formikHelpers.setFieldError(
                "currentUsername",
                t("forbiddenUsername"),
              );
              return;
            }
          }
        }

        setGlobalError(t("error"));
      } finally {
        formikHelpers.setSubmitting(false);
      }
    },
    [api, mutate, t],
  );

  return (
    <div className="flex flex-col gap-2">
      {globalError && <div className="text-sm text-red-500">{globalError}</div>}
      <Formik
        enableReinitialize
        initialValues={{ currentUsername: username }}
        validationSchema={schema}
        onSubmit={changeUsername}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit} validationBehavior="aria">
            <div className="flex items-start gap-1">
              <TextField
                className="grow"
                placeholder={t("noUsername")}
                value={props.values.currentUsername}
                onBlur={props.handleBlur}
                onChange={(value) => {
                  props.setFieldValue("currentUsername", value);
                  props.setFieldTouched("currentUsername", true, false);
                }}
                isInvalid={
                  !!props.touched.currentUsername &&
                  !!props.errors.currentUsername
                }
                errorMessage={props.errors.currentUsername}
                isDisabled={props.isSubmitting}
                description={t("displayNameDescription")}
              />
              {username && suffix && (
                <div className="flex h-9 items-center">#{suffix}</div>
              )}
              {props.touched.currentUsername &&
                props.values.currentUsername !== username && (
                  <Button variant="icon" className="h-9" type="submit">
                    {props.isSubmitting ? (
                      <Spinner size={16} />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

interface ProfileSectionProps {
  close: () => void;
}

export function ProfileSection({ close }: ProfileSectionProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("IdentityDialog.profile");

  const [showSignOutSection, setShowSignOutSection] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const identity = useAppSelector((state) => state.ident.identity);

  const onReset = useCallback(() => {
    dispatch(identSlice.actions.clearIdentity());
    close();
  }, [dispatch, close]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
        <IdentIcon value={identity || ""} />
      </div>
      <div className="w-full space-y-2 rounded-md md:border md:border-slate-200 md:p-4 dark:md:border-slate-600">
        <div className="font-semibold">{t("uniqueId")}</div>
        <div className="flex items-center gap-2">
          <TextField
            className="grow"
            isReadOnly
            value={identity || "Anonymous"}
          />
          <CopyButton text={identity || ""} disabled={!identity} />
        </div>
        <div className="font-semibold">{t("displayName")}</div>
        <DisplayNameInput />
      </div>
      <div className="flex w-full flex-col gap-4">
        <button
          className="w-fit cursor-pointer text-sm hover:underline"
          onClick={() => setShowSignOutSection(!showSignOutSection)}
        >
          {showSignOutSection ? (
            <div className="flex items-center gap-1 text-sm text-red-500">
              {t("signOut.title")} <ChevronUp className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-red-500">
              {t("signOut.title")} <ChevronDown className="h-4 w-4" />
            </div>
          )}
        </button>
        {showSignOutSection && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-md border border-red-500 p-4">
              <div className="text-sm">{t("signOut.description")}</div>
              <div className="flex flex-col gap-4">
                <Checkbox
                  isSelected={resetConfirmed}
                  onChange={(isSelected) => setResetConfirmed(isSelected)}
                  className="!text-sm"
                >
                  {t("signOut.confirm")}
                </Checkbox>
                <Button
                  isDisabled={!resetConfirmed}
                  className="w-fit"
                  variant="secondary"
                  onPress={onReset}
                >
                  {t("signOut.submit")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
