"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { StackTemplate } from "@/components/templates/StackTemplate";
import { Button } from "@/components/atoms/Button";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");
  const router = useRouter();

  useEffect(() => {
    document.title = t("title");
  }, [t]);

  return (
    <StackTemplate>
      <div className="relative isolate flex grow items-center justify-center overflow-hidden px-4 py-12">
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="flex max-w-screen-sm flex-col items-center">
              <h1 className="mb-4 text-center text-7xl font-extrabold tracking-tight text-green-600 lg:text-9xl dark:text-green-600">
                404
              </h1>
              <p className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                {t("headline")}
              </p>
              <p className="mb-4 text-center text-lg font-light text-gray-500 dark:text-gray-400">
                {t("description")}
              </p>
              <Button
                variant="primary"
                className="w-fit"
                onPress={() => router.push("/")}
              >
                {t("backToHomepage")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StackTemplate>
  );
}
