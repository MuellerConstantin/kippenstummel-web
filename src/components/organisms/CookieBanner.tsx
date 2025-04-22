"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import privacySlice from "@/store/slices/privacy";

interface CookieBannerProps {
  onConsent: () => void;
}

export function CookieBanner(props: CookieBannerProps) {
  const dispatch = useAppDispatch();

  const cookiesAllowed = useAppSelector(
    (state) => state.privacy.cookiesAllowed,
  );

  const [open, setOpen] = useState(false);

  const allowCookies = () => {
    dispatch(privacySlice.actions.setCookiesAllowed(true));
    setOpen(false);
    props.onConsent();
  };

  const denyCookies = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!cookiesAllowed) {
      setOpen(true);
    }
  }, [cookiesAllowed]);

  if (open) {
    return (
      <div className="fixed right-0 bottom-0 z-[1000] p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-50 p-6 text-left align-middle text-slate-800 shadow-xl">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">We use cookies!</h2>
            <p className="text-sm">
              This website uses cookies and similar technologies to improve your
              experience and ensure functionalities. Some features may not work
              properly without cookies. For more information, see our{" "}
              <Link href="/privacy">Privacy Policy</Link>.
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
