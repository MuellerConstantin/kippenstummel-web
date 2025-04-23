"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import privacySlice from "@/store/slices/privacy";

interface CookieBannerProps {}

export function CookieBanner(props: CookieBannerProps) {
  const dispatch = useAppDispatch();

  const cookiesAllowed = useAppSelector(
    (state) => state.privacy.cookiesAllowed,
  );

  const [open, setOpen] = useState(false);

  const allowCookies = () => {
    dispatch(privacySlice.actions.setCookiesAllowed(true));
    setOpen(false);
  };

  const denyCookies = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!cookiesAllowed) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [cookiesAllowed]);

  if (open) {
    return (
      <div className="fixed right-0 bottom-0 z-[1000] p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-50 p-6 text-left align-middle text-slate-800 shadow-xl dark:bg-slate-700 dark:text-white">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">We use cookies!</h2>
            <p className="text-sm">
              This website uses cookies or similar technologies, to implement
              essential features and to enhance your browsing experience.
              Additionally, we integrate third-party services that may also use
              cookies or similar technologies. We need your consent to proceed.
              Some features may not work properly without cookies. For more
              information, see our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
            <Button variant="primary" className="w-full" onPress={allowCookies}>
              Allow Cookies
            </Button>
            <div className="flex justify-center">
              <button
                type="button"
                className="text-xs hover:underline"
                onClick={denyCookies}
              >
                Deny Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
