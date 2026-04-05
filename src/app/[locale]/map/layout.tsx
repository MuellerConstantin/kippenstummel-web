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
  const t = await getTranslations({ locale, namespace: "MapPage" });

  return {
    title: t("meta.title"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/map`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}/map`]),
        ),
        "x-default": `${BASE_URL}/de/map`,
      },
    },
  };
}

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MapTemplate>{children}</MapTemplate>;
}
