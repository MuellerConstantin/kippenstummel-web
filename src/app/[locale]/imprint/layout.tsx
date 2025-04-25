import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StackTemplate } from "@/components/templates/StackTemplate";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ImprintPage" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default function ImprintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
