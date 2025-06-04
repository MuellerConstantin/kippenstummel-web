import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { StoreProvider } from "@/store";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { NotificationView } from "@/components/organisms/NotificationView";
import { RequireIdentInterceptor } from "@/components/organisms/ident/RequireIdentInterceptor";

import "./globals.css";
import { PWAInstallProvider } from "@/contexts/PWAInstallProvider";

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
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Kippenstummel" />
        <link rel="manifest" href={`/manifest.${locale}.json`} />
      </head>
      <body className={`${lato.variable} bg-white dark:bg-slate-800`}>
        <NextIntlClientProvider>
          <StoreProvider>
            <NotificationProvider>
              <PWAInstallProvider>
                <RequireIdentInterceptor>
                  {children}
                  <NotificationView />
                </RequireIdentInterceptor>
              </PWAInstallProvider>
            </NotificationProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
