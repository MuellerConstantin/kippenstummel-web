"use client";

import React from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { MinimalFooter } from "@/components/molecules/MinimalFooter";
import PreReleaseBanner from "@/components/organisms/PreReleaseBanner";
import TestSystemBanner from "../organisms/TestSystemBanner";
import { useEnv } from "@/contexts/RuntimeConfigProvider";

export function MapTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isTestSystem = useEnv("NEXT_PUBLIC_IS_TEST_SYSTEM") === "true";
  const isPreRelease = useEnv("NEXT_PUBLIC_IS_PRE_RELEASE") === "true";

  return (
    <div className="flex h-full min-h-[100dvh] flex-col">
      <header>
        <Navbar />
        {isTestSystem && <TestSystemBanner />}
        {isPreRelease && <PreReleaseBanner />}
      </header>
      <main className="flex grow flex-col bg-white dark:bg-slate-800">
        {children}
      </main>
      <footer>
        <MinimalFooter />
      </footer>
    </div>
  );
}
