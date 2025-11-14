import React, { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik } from "formik";
import * as yup from "yup";
import { DialogProps, Heading, Key } from "react-aria-components";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "react-qr-code";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { IdentIcon } from "@/components/atoms/IdentIcon";
import { Checkbox } from "@/components/atoms/Checkbox";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  Check,
  Copy,
  TriangleAlert,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
import { AxiosError } from "axios";
import { ApiError } from "@/lib/types/error";
import useSWR from "swr";
import { Pagination } from "@/components/molecules/Pagination";

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

function MyIdentityDataSection() {
  const t = useTranslations("IdentityDialog.profile");
  const identity = useAppSelector((state) => state.ident.identity);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
        <IdentIcon value={identity || ""} />
      </div>
      <div className="brorder-slate-200 w-full space-y-2 rounded-md border p-4 dark:border-slate-600">
        <div className="font-semibold">{t("uniqueId")}</div>
        <div className="flex items-center gap-2">
          <div className="overflow-x-auto pb-2 text-xs whitespace-nowrap">
            {identity || "Anonymous"}
          </div>
          <div className="pb-2">
            <CopyButton text={identity || ""} disabled={!identity} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MyAuthenticationDataSectionProps {
  close: () => void;
}

function MyAuthenticationDataSection(props: MyAuthenticationDataSectionProps) {
  const { close } = props;

  const t = useTranslations("IdentityDialog.authentication");
  const dispatch = useAppDispatch();

  const [showSecret, setShowSecret] = useState(false);
  const [showResetSection, setShowResetSection] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const identity = useAppSelector((state) => state.ident.identity);
  const secret = useAppSelector((state) => state.ident.secret);

  const onReset = useCallback(() => {
    dispatch(identSlice.actions.clearIdentity());
    close();
  }, [dispatch, close]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="text-sm">
          {t.rich("description", {
            b: (chunks) => <span className="font-semibold">{chunks}</span>,
          })}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-1">
            <TextField
              label={t("form.id")}
              className="grow"
              value={identity || ""}
              isReadOnly
            />
            <CopyButton
              text={identity || ""}
              disabled={!identity}
              className="h-9"
            />
          </div>
          <div className="flex items-end gap-1">
            <TextField
              label={t("form.secret")}
              className="grow"
              value={secret || ""}
              type={showSecret ? "text" : "password"}
              isReadOnly
            />
            <Button
              variant="icon"
              className="h-9"
              onPress={() => setShowSecret(!showSecret)}
            >
              {showSecret ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            <CopyButton
              text={secret || ""}
              disabled={!secret}
              className="h-9"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button
          className="w-fit cursor-pointer text-sm text-red-500 hover:underline"
          onClick={() => setShowResetSection(!showResetSection)}
        >
          {showResetSection ? (
            <div className="flex items-center gap-1">
              {t("reset.spoiler")} <ChevronUp className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {t("reset.spoiler")} <ChevronDown className="h-4 w-4" />
            </div>
          )}
        </button>
        {showResetSection && (
          <div className="flex flex-col gap-4">
            <div className="text-sm">{t("reset.description")}</div>
            <div className="flex flex-col gap-4">
              <Checkbox
                isSelected={resetConfirmed}
                onChange={(isSelected) => setResetConfirmed(isSelected)}
              >
                {t("reset.confirm")}
              </Checkbox>
              <Button
                isDisabled={!resetConfirmed}
                className="w-fit"
                variant="secondary"
                onPress={onReset}
              >
                {t("reset.submit")}
              </Button>
            </div>
            <div className="flex w-full gap-2">
              <TriangleAlert className="h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs">
                {t.rich("reset.disclaimer", {
                  link1: (chunks) => (
                    <Link href="/terms-of-service">{chunks}</Link>
                  ),
                  link2: (chunks) => (
                    <Link href="/privacy-policy">{chunks}</Link>
                  ),
                  b: (chunks) => (
                    <span className="font-semibold">{chunks}</span>
                  ),
                })}
              </p>
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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const onTransfer = useCallback(
    async ({ password }: { password: string }) => {
      setIsLoading(true);
      setError(null);
      setToken(null);

      const encrypted = await encryptWithPassword(secret!, password);

      api
        .post<{ identity: string; token: string }>("/ident/transfer", {
          identity,
          encryptedSecret: encrypted,
        })
        .then((res) => {
          setToken(res.data.token);
        })
        .catch(() => {
          setError(t("form.error"));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [secret, identity, api, t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm">
        {t.rich("description", {
          link: (chunks) => <Link href="/terms-of-service">{chunks}</Link>,
        })}
      </div>
      {!token && (
        <>
          <div className="text-sm">{t("form.description")}</div>
          <div className="flex flex-col gap-2">
            {error && <p className="text-center text-red-500">{error}</p>}
            <Formik<{ password: string }>
              initialValues={{ password: "" }}
              validationSchema={schema}
              onSubmit={(values) => onTransfer(values)}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit} validationBehavior="aria">
                  <TextField
                    label={t("form.transportPassword")}
                    name="password"
                    type="password"
                    value={props.values.password}
                    onBlur={props.handleBlur}
                    isDisabled={isLoading}
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
                    isDisabled={!(props.isValid && props.dirty) || isLoading}
                  >
                    {!isLoading && <span>{t("form.submit")}</span>}
                    {isLoading && <Spinner />}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
      {token && (
        <div className="flex flex-col gap-4">
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
          <div className="flex h-32 w-fit justify-start">
            <QRCode
              value={`${window.location.protocol}//${window.location.host}/transfer?token=${token}`}
              className="h-full w-fit overflow-hidden"
            />
          </div>
        </div>
      )}
      <div className="flex w-full gap-2">
        <TriangleAlert className="h-4 w-4 shrink-0 text-green-600" />
        <p className="text-xs">{t("disclaimer")}</p>
      </div>
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
                className="flex items-center justify-between px-2 py-1"
              >
                <div
                  className={`font-semibold ${
                    event.delta > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {event.delta > 0 ? `+${event.delta}` : event.delta}
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium">
                    {t.rich(`messages.${event.type}`, {
                      link: (chunks) => (
                        <Link href={`/map?shared=${event.cvmId}`}>
                          {chunks}
                        </Link>
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IdentityDialogProps extends Omit<DialogProps, "children"> {}

export function IdentityDialog(props: IdentityDialogProps) {
  const t = useTranslations("IdentityDialog");

  const tabs = useMemo(
    () => [
      {
        id: "identity-tab-overview",
        label: t("tabs.profile"),
        component: <MyIdentityDataSection />,
      },
      {
        id: "identity-tab-credentials",
        label: t("tabs.credentials"),
        component: ({ close }: { close: () => void }) => (
          <MyAuthenticationDataSection close={close} />
        ),
      },
      {
        id: "identity-tab-transfer",
        label: t("tabs.transfer"),
        component: <TransferIdentitySection />,
      },
      {
        id: "identity-tab-karma",
        label: t("tabs.karma"),
        component: <KarmaSection />,
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
    <Dialog {...props}>
      {({ close }) => (
        <div className="flex h-[70vh] flex-col">
          <Heading
            slot="title"
            className="my-0 shrink-0 text-xl leading-6 font-semibold"
          >
            {t("title")}
          </Heading>
          <div className="mt-4 flex min-h-0 grow flex-col items-start gap-4">
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
            <div className="flex w-full shrink-0 justify-start gap-4">
              <Button onPress={close} className="w-full">
                {t("close")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
