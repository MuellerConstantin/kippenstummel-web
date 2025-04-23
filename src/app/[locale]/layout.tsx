import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { StoreProvider } from "@/store";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { NotificationView } from "@/components/organisms/NotificationView";
import { RefreshIdentInterceptor } from "@/components/organisms/ident/RefreshIdentInterceptor";

import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kippenstummel",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      </head>
      <body className={`${lato.variable} bg-white dark:bg-slate-800`}>
        <NextIntlClientProvider>
          <StoreProvider>
            <NotificationProvider>
              <RefreshIdentInterceptor>
                {children}
                <NotificationView />
              </RefreshIdentInterceptor>
            </NotificationProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
