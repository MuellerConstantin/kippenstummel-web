import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MapTemplate } from "@/components/templates/MapTemplate";
import { buildPageMetadata } from "@/lib/server/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    namespace: "MapPage",
    path: "/map",
    withDescription: true,
  });
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
