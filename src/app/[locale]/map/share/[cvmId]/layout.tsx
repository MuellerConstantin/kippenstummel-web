import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kippenstummel.de";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SharePage" });

  return {
    title: t("meta.title"),
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      type: "website",
      siteName: t("meta.title"),
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      url: `${BASE_URL}/${locale}`,
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("meta.ogTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      images: [`${BASE_URL}/og-image.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/home`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}/home`]),
        ),
        "x-default": `${BASE_URL}/de/home`,
      },
    },
  };
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
