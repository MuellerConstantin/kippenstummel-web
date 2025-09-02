"use client";

import React from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { MinimalFooter } from "@/components/molecules/MinimalFooter";
import OfflineBanner from "@/components/organisms/OfflineBanner";

export function MapTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header>
        <Navbar />
        <OfflineBanner />
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
