"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import privacySlice from "@/store/slices/privacy";

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const dispatch = useAppDispatch();

  const cookiesAllowed = useAppSelector(
    (state) => state.privacy.cookiesAllowed,
  );

  const [open, setOpen] = useState(false);

  const allowCookies = () => {
    dispatch(privacySlice.actions.setCookiesAllowed(true));
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
            <h2 className="text-xl font-bold">{t("title")}</h2>
            <p className="text-sm">
              {t.rich("description", {
                link: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
              })}
            </p>
            <Button variant="primary" className="w-full" onPress={allowCookies}>
              {t("confirm")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
