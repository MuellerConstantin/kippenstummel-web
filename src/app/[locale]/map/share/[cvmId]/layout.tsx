import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kippenstummel.de";

type Props = {
  params: {
    locale: string;
    cvmId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
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
      canonical: `${BASE_URL}/${locale}/map`,
    },
  };
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Wichtig:
   * - KEIN HTML
   * - KEIN Body
   * - nur Wrapper
   */
  return <>{children}</>;
}
