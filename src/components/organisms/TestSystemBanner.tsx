"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/components/atoms/Link";
import { TriangleAlert as TriangleAlertIcon } from "lucide-react";

export default function TestSystemBanner() {
  const t = useTranslations("TestSystemBanner");

  return (
    <div className="border-b border-b-amber-600 bg-amber-300 text-amber-600 dark:border-b-amber-200 dark:bg-amber-600 dark:text-amber-200">
      <div className="flex items-center justify-center p-2">
        <div className="flex flex-wrap justify-center gap-1 text-center text-xs">
          <div>
            <TriangleAlertIcon className="inline-block h-4 w-4 align-text-bottom" />
            &nbsp;
            {t.rich("message", {
              bold: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </div>
          <Link
            variant="secondary"
            className="cursor-pointer"
            href="https://kippenstummel.de"
          >
            {t("redirect")}
          </Link>
        </div>
      </div>
    </div>
  );
}
