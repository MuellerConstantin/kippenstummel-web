"use client";

import { Construction, X } from "lucide-react";
import { Button } from "../atoms/Button";
import { useTranslations } from "next-intl";
import { Link } from "../atoms/Link";
import { useState } from "react";

export function PreReleaseBanner() {
  const t = useTranslations("PreReleaseBanner");

  const [closed, setClosed] = useState(false);

  if (closed) {
    return null;
  }

  return (
    <div className="fixed start-0 bottom-0 z-[5000] flex w-full justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700">
      <div className="mx-auto flex items-center">
        <p className="flex items-center text-sm font-normal text-slate-500 dark:text-slate-400">
          <span className="me-3 inline-flex shrink-0 items-center justify-center rounded-full bg-slate-200 p-2 dark:bg-slate-600">
            <Construction className="h-4 w-4 text-amber-500" />
          </span>
          <span>
            {t.rich("notice", {
              highlight: (chunks) => (
                <span className="font-semibold text-amber-500">{chunks}</span>
              ),
              link: (chunks) => (
                <Link
                  href="https://github.com/MuellerConstantin/kippenstummel-web/issues"
                  target="_blank"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </p>
      </div>
      <div className="flex items-center">
        <Button variant="icon" onPress={() => setClosed(true)}>
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
