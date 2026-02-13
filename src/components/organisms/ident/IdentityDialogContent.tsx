import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Key } from "react-aria-components";
import { motion, AnimatePresence } from "motion/react";
import { ReactQRCode } from "@lglab/react-qr-code";
import { Button } from "@/components/atoms/Button";
import { IdentIcon } from "@/components/atoms/IdentIcon";
import { Checkbox } from "@/components/atoms/Checkbox";
import { useAppDispatch, useAppSelector } from "@/store";
import { Check, Copy, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { TextField } from "@/components/atoms/TextField";
import { Form } from "@/components/atoms/Form";
import { Spinner } from "@/components/atoms/Spinner";
import { encryptWithPassword } from "@/lib/encrypt";
import useApi from "@/hooks/useApi";
import { Tab, TabList, TabPanel, Tabs } from "@/components/atoms/Tabs";
import identSlice from "@/store/slices/ident";
import { Page } from "@/lib/types/pagination";
import { IdentInfo, KarmaEvent } from "@/lib/types/ident";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/lib/types/error";
import useSWR from "swr";
import { Pagination } from "@/components/molecules/Pagination";
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

interface MyIdentityDataSectionProps {
  close: () => void;
}

function MyIdentityDataSection({ close }: MyIdentityDataSectionProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("IdentityDialog.profile");

  const [
    showAuthenticationDetailsSection,
    setShowAuthenticationDetailsSection,
  ] = useState(false);
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
          onClick={() =>
            setShowAuthenticationDetailsSection(
              !showAuthenticationDetailsSection,
            )
          }
        >
          {showAuthenticationDetailsSection ? (
            <div className="flex items-center gap-1">
              {t("authentication.title")} <ChevronUp className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {t("authentication.title")} <ChevronDown className="h-4 w-4" />
            </div>
          )}
        </button>
        {showAuthenticationDetailsSection && (
          <div className="flex flex-col gap-4">
            <div className="text-sm">
              {t.rich("authentication.description", {
                b: (chunks) => <span className="font-semibold">{chunks}</span>,
              })}
            </div>
            <div className="flex flex-col gap-4 rounded-md border border-red-500 p-4">
              <div className="text-sm text-red-500">
                {t("authentication.reset.title")}
              </div>
              <div className="text-sm">
                {t("authentication.reset.description")}
              </div>
              <div className="flex flex-col gap-4">
                <Checkbox
                  isSelected={resetConfirmed}
                  onChange={(isSelected) => setResetConfirmed(isSelected)}
                  className="!text-sm"
                >
                  {t("authentication.reset.confirm")}
                </Checkbox>
                <Button
                  isDisabled={!resetConfirmed}
                  className="w-fit"
                  variant="secondary"
                  onPress={onReset}
                >
                  {t("authentication.reset.submit")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TransferIdentitySection() {
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

function KarmaSection() {
  const api = useApi();
  const t = useTranslations("IdentityDialog.karma");

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const {
    data: meData,
    error: meError,
    isLoading: meIsLoading,
  } = useSWR<IdentInfo, AxiosError<ApiError>, string>("/ident/me", (url) =>
    api.get(url).then((res) => res.data),
  );

  const { data, error, isLoading } = useSWR<
    Page<KarmaEvent>,
    AxiosError<ApiError>,
    string
  >(`/karma/me?page=${page - 1}&perPage=${perPage}`, (url) =>
    api.get(url).then((res) => res.data),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm">{t("description")}</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div>{t("myKarma")}</div>
          {meIsLoading ? (
            <div className="h-5 w-12 animate-pulse truncate rounded-lg bg-slate-300 dark:bg-slate-700" />
          ) : meError ? (
            <div className="h-5 w-12 truncate rounded-lg bg-red-300 dark:bg-red-800" />
          ) : (
            meData && (
              <div className="w-fit truncate rounded-lg bg-green-600 p-1 text-xs text-white">
                {meData.karma >= 0 ? `+${meData.karma}` : meData.karma}
              </div>
            )
          )}
        </div>
        <hr className="border-slate-400 dark:border-gray-700" />
      </div>
      {isLoading ? (
        <ul className="divide-y divide-gray-200 rounded-md border border-slate-400 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {Array.from(Array(5).keys()).map((key) => (
            <li
              key={key}
              className="flex items-center justify-between px-2 py-1"
            >
              <div className="h-5 w-10 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-700" />
              <div className="flex flex-col items-end gap-1">
                <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-700" />
                <div className="h-2 w-16 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-700" />
              </div>
            </li>
          ))}
        </ul>
      ) : error ? (
        <ul className="divide-y divide-gray-200 rounded-md border border-slate-400 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {Array.from(Array(5).keys()).map((key) => (
            <li
              key={key}
              className="flex items-center justify-between px-2 py-1"
            >
              <div className="h-5 w-10 rounded-lg bg-red-300 dark:bg-red-800" />
              <div className="flex flex-col items-end gap-1">
                <div className="h-4 w-32 rounded-lg bg-red-300 dark:bg-red-800" />
                <div className="h-2 w-16 rounded-lg bg-red-300 dark:bg-red-800" />
              </div>
            </li>
          ))}
        </ul>
      ) : data && data.content.length > 0 ? (
        <div className="flex flex-col gap-4">
          <ul className="divide-y divide-gray-200 rounded-md border border-slate-400 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
            {data.content.map((event, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-4 px-2 py-1"
              >
                <div
                  className={`shrink-0 font-semibold ${
                    event.delta > 0
                      ? "text-green-600"
                      : event.delta < 0
                        ? "text-red-600"
                        : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {event.delta > 0
                    ? `+${event.delta}`
                    : event.delta < 0
                      ? `${event.delta}`
                      : `±${event.delta}`}
                </div>
                <div className="flex grow flex-col text-right">
                  <span className="text-left text-xs font-medium">
                    {t.rich(`messages.${event.type}`, {
                      link: (chunks) => (
                        <Link href={`/map/share/${event.cvmId}`}>{chunks}</Link>
                      ),
                    })}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.occurredAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            totalPages={data!.info.totalPages}
            currentPage={page}
            onPageChange={setPage}
            size="sm"
          />
        </div>
      ) : (
        <div className="text-center text-sm">{t("noEvents")}</div>
      )}
    </div>
  );
}

export function IdentityDialogContent() {
  const t = useTranslations("IdentityDialog");

  const tabs = useMemo(
    () => [
      {
        id: "identity-tab-overview",
        label: t("tabs.profile"),
        component: ({ close }: { close: () => void }) => (
          <MyIdentityDataSection close={close} />
        ),
      },
      {
        id: "identity-tab-karma",
        label: t("tabs.karma"),
        component: <KarmaSection />,
      },
      {
        id: "identity-tab-transfer",
        label: t("tabs.transfer"),
        component: <TransferIdentitySection />,
      },
    ],
    [t],
  );

  const [selectedKey, setSelectedKey] = useState<Key>(tabs[0].id);
  const [direction, setDirection] = useState(0);

  const onSelectionChange = useCallback(
    (newKey: Key) => {
      const oldIndex = tabs.findIndex((t) => t.id === selectedKey);
      const newIndex = tabs.findIndex((t) => t.id === newKey);
      setDirection(newIndex > oldIndex ? 1 : -1);
      setSelectedKey(newKey);
    },
    [selectedKey, tabs],
  );

  return (
    <div className="flex min-h-0 grow flex-col items-start gap-4">
      <Tabs
        orientation="horizontal"
        className="min-h-0 w-full grow"
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
      >
        <TabList
          className="scrollbar-hide shrink-0 overflow-x-auto"
          items={tabs}
        >
          {(tab) => (
            <Tab className="w-fit min-w-fit" id={tab.id}>
              {tab.label}
            </Tab>
          )}
        </TabList>
        <div className="relative min-h-0 grow overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            {tabs.map(
              (tab) =>
                tab.id === selectedKey && (
                  <motion.div
                    key={tab.id}
                    custom={direction}
                    variants={{
                      enter: (dir) => ({
                        x: dir > 0 ? 50 : -50,
                        opacity: 0,
                        position: "absolute",
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        position: "relative",
                      },
                      exit: (dir) => ({
                        x: dir > 0 ? -50 : 50,
                        opacity: 0,
                        position: "absolute",
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="absolute inset-0 p-0"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const offset = info.offset.x;
                      const velocity = info.velocity.x;

                      const currentIndex = tabs.findIndex(
                        (t) => t.id === selectedKey,
                      );

                      // Swipe to right -> previous tab
                      if (offset > 120 || velocity > 800) {
                        const prev = currentIndex - 1;
                        if (prev >= 0) {
                          setDirection(-1);
                          setSelectedKey(tabs[prev].id);
                        }
                      }

                      // Swipe to left → next tab
                      if (offset < -120 || velocity < -800) {
                        const next = currentIndex + 1;
                        if (next < tabs.length) {
                          setDirection(1);
                          setSelectedKey(tabs[next].id);
                        }
                      }
                    }}
                  >
                    <TabPanel id={tab.id} shouldForceMount>
                      {typeof tab.component === "function"
                        ? tab.component({ close })
                        : tab.component}
                    </TabPanel>
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
