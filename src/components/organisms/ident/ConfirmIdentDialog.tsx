import React, { use, useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { TextField } from "@/components/atoms/TextField";
import { Spinner } from "@/components/atoms/Spinner";
import useApi from "@/hooks/useApi";
import { useAppDispatch } from "@/store";
import identSlice from "@/store/slices/ident";
import { solveChallenge } from "@/api/pow";
import { getFingerprint } from "@/api/fingerprint";

interface ConfirmIdentDialogProps extends Omit<DialogProps, "children"> {}

export function ConfirmIdentDialog(props: ConfirmIdentDialogProps) {
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
        any,
        AxiosResponse<{ id: string; content: string }>
      >("/captcha");

      const powRes = await api.get("/pow");

      setCaptcha(captchaRes.data);
      setPow(powRes.headers["x-pow"]);
    } catch (err) {
      setError("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = useCallback(
    async (close: () => void) => {
      setSubmitError(null);
      setSubmitting(true);

      try {
        const powSolution = await solveChallenge(pow!);
        const fingerprint = await getFingerprint();

        const res = await api.post("/ident", fingerprint, {
          headers: {
            "x-captcha": `${captcha!.id}:${captchaSolution}`,
            "x-pow": `${pow}:${powSolution}`,
          },
        });

        dispatch(identSlice.actions.setToken(res.data.token));
        close();
      } catch (err) {
        setSubmitError("Unexpected error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [captchaSolution, captcha, pow],
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
            Confirm your Identity
          </Heading>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              To help keep our platform secure, we need to verify that you're a
              real person. Please complete the CAPTCHA below.
            </div>
            <div className="flex justify-center">
              {loading ? (
                <div>
                  <Spinner size={32} />
                </div>
              ) : error || submitError ? (
                <span className="text-red-500">{error || submitError}</span>
              ) : (
                <img src={captcha?.content} alt="CAPTCHA" className="w-[80%]" />
              )}
            </div>
            <div className="flex flex-col gap-4">
              <TextField
                placeholder="Enter CAPTCHA"
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
                  {submitting ? <Spinner /> : "Confirm"}
                </div>
              </Button>
            </div>
            <div className="text-xs">
              By confirming, you agree to our{" "}
              <Link href="/terms-of-service">Terms of Service</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
