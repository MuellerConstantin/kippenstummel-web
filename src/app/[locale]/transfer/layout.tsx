import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MapTemplate } from "@/components/templates/MapTemplate";
import { routing } from "@/i18n/routing";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kippenstummel.de";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TransferPage" });

  return {
    title: t("meta.title"),
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/transfer`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}/transfer`]),
        ),
        "x-default": `${BASE_URL}/de/transfer`,
      },
    },
  };
}

export default async function TransferLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MapTemplate>{children}</MapTemplate>;
}
