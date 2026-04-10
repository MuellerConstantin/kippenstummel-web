import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { StoreProvider } from "@/store";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { NotificationView } from "@/components/organisms/NotificationView";
import { RequireIdentInterceptor } from "@/components/organisms/ident/RequireIdentInterceptor";
import { AckeeTracker } from "@/components/organisms/AckeeTracker";
import { RuntimeConfigProvider } from "@/contexts/RuntimeConfigProvider";
import { PWAInstallProvider } from "@/contexts/PWAInstallProvider";
import { OfflineHandler } from "@/components/organisms/OfflineHandler";
import { InstallRequestNotificationHandler } from "@/components/organisms/InstallRequestNotificationHandler";

import "./globals.css";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kippenstummel.de";

const outfit = Outfit({
  variable: "--font-outfit",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });

  return {
    title: {
      default: t("title"),
      template: `%s · ${t("title")}`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: t("title"),
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${BASE_URL}/${locale}`,
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("ogTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [`${BASE_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(BASE_URL),
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#16a34a",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  modal,
  params,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96.png"
          sizes="96x96"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Kippenstummel" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="manifest" href={`/manifest.${locale}.json`} />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${outfit.variable} bg-white dark:bg-slate-800`}>
        <NextIntlClientProvider>
          <StoreProvider>
            <NotificationProvider>
              <PWAInstallProvider>
                <RequireIdentInterceptor>
                  <RuntimeConfigProvider>
                    {children}
                    {modal}
                    <NotificationView />
                    <AckeeTracker />
                    <OfflineHandler />
                    <InstallRequestNotificationHandler />
                  </RuntimeConfigProvider>
                </RequireIdentInterceptor>
              </PWAInstallProvider>
            </NotificationProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
