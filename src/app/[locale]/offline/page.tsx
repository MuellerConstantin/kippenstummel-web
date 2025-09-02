"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { RotateCw as RotateCwIcon, WifiOff as WifiOffIcon } from "lucide-react";

export default function Offline() {
  const t = useTranslations("OfflinePage");
  const router = useRouter();

  useEffect(() => {
    document.title = t("meta.title");
    document
      .querySelector("meta[name='description']")
      ?.setAttribute("content", t("meta.description"));
  }, [t]);

  return (
    <div className="relative isolate flex grow items-center justify-center overflow-hidden px-4 py-12">
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="flex max-w-screen-sm flex-col items-center">
            <h1 className="mb-4 flex items-center gap-4 text-center text-7xl font-extrabold tracking-tight text-green-600 lg:text-9xl dark:text-green-600">
              <WifiOffIcon className="h-16 w-16" />
            </h1>
            <p className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              {t("headline")}
            </p>
            <p className="mb-4 text-center text-lg font-light text-gray-500 dark:text-gray-400">
              {t("description")}
            </p>
            <Button
              variant="primary"
              className="flex w-fit items-center justify-center gap-2"
              onPress={() => router.push("/")}
            >
              <span>{t("retry")}</span>
              <RotateCwIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
