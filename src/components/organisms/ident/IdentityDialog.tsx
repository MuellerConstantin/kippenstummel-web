import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Formik } from "formik";
import * as yup from "yup";
import { DialogProps, Heading } from "react-aria-components";
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
import { encryptWithPassword } from "@/lib";
import useApi from "@/hooks/useApi";
import { Tab, TabList, TabPanel, Tabs } from "@/components/atoms/Tabs";
import identSlice from "@/store/slices/ident";

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
        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-4 w-4" />}
      </div>
    </Button>
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IdentityDialogProps extends Omit<DialogProps, "children"> {}

export function IdentityDialog(props: IdentityDialogProps) {
  const t = useTranslations("IdentityDialog");

  const identity = useAppSelector((state) => state.ident.identity);

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
          <div className="mt-4 flex flex-col items-start gap-4">
            <Tabs orientation="horizontal" className="w-full">
              <TabList className="overflow-x-scroll pb-2">
                <Tab className="w-fit min-w-fit" id="identity-tab-overview">
                  {t("tabs.profile")}
                </Tab>
                <Tab className="w-fit min-w-fit" id="identity-tab-credentials">
                  {t("tabs.credentials")}
                </Tab>
                <Tab className="w-fit min-w-fit" id="identity-tab-transfer">
                  {t("tabs.transfer")}
                </Tab>
              </TabList>
              <TabPanel id="identity-tab-overview" className="p-0">
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="h-32 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                    <IdentIcon value={identity || ""} />
                  </div>
                  <div className="brorder-slate-200 w-full space-y-2 rounded-md border p-4 dark:border-slate-600">
                    <div className="font-semibold">{t("uniqueId")}</div>
                    <div className="flex items-center gap-2">
                      <div className="overflow-x-scroll pb-2 text-xs whitespace-nowrap">
                        {identity || "Anonymous"}
                      </div>
                      <div className="pb-2">
                        <CopyButton
                          text={identity || ""}
                          disabled={!identity}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel id="identity-tab-credentials" className="p-0">
                <MyAuthenticationDataSection close={close} />
              </TabPanel>
              <TabPanel id="identity-tab-transfer" className="p-0">
                <TransferIdentitySection />
              </TabPanel>
            </Tabs>
            <div className="flex w-full justify-start gap-4">
              <Button onPress={close} className="w-full">
                {t("close")}
              </Button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
