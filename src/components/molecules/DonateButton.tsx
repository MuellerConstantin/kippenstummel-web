"use client";

import { HandCoins } from "lucide-react";
import { useTranslations } from "next-intl";

export function DonateButton() {
  const t = useTranslations("DonateButton");

  return (
    <button
      onClick={() =>
        window.open(
          "https://ko-fi.com/muellerconstantin/tip",
          "_blank",
          "noopener,noreferrer",
        )
      }
      className="inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-green-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg ring-1 shadow-green-600/30 ring-green-400/40 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-green-600/40 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
    >
      <HandCoins className="h-5 w-5" />
      {t("title")}
    </button>
  );
}
