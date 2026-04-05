import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StackTemplate } from "@/components/templates/StackTemplate";
import { routing } from "@/i18n/routing";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kippenstummel.de";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TermsOfServicePage" });

  return {
    title: t("meta.title"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/terms-of-service`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}/terms-of-service`]),
        ),
        "x-default": `${BASE_URL}/de/terms-of-service`,
      },
    },
  };
}

export default function TermsOfServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
