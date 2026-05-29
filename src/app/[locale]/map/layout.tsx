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
    description: t("meta.description"),
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

export default async function MapLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MapPage" });

  return (
    <MapTemplate>
      <h1 className="sr-only">{t("headline")}</h1>
      {children}
    </MapTemplate>
  );
}
