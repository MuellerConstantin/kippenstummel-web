import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MapTemplate } from "@/components/templates/MapTemplate";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TransferPage" });

  return {
    title: t("meta.title"),
  };
}

export default function TransferLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MapTemplate>{children}</MapTemplate>;
}
