"use client";

import React, { useMemo } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/molecules/Footer";
import { useEnv } from "@/contexts/RuntimeConfigProvider";
import { MessageBannerCarousel } from "../organisms/MessageBannerCarousel";
import { useTranslations } from "next-intl";

export function StackTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();

  const isTestSystem = useEnv("NEXT_PUBLIC_IS_TEST_SYSTEM") === "true";

  const messages = useMemo(() => {
    const messages: {
      title: string;
      description: string;
      variant?: "default" | "success" | "error" | "info" | "warning";
    }[] = [];

    if (isTestSystem) {
      messages.push({
        title: t("MessageBannerCarousel.messages.testSystem.title"),
        description: t("MessageBannerCarousel.messages.testSystem.description"),
        variant: "warning",
      });
    }

    return messages;
  }, [isTestSystem, t]);

  return (
    <div className="flex h-full min-h-[100dvh] flex-col">
      <header>
        <Navbar />
        <MessageBannerCarousel messages={messages} />
      </header>
      <main className="flex grow flex-col bg-white dark:bg-slate-800">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
