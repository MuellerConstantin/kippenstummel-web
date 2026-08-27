import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";
import { buildPageMetadata } from "@/lib/server/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    namespace: "TermsOfServicePage",
    path: "/terms-of-service",
  });
}

export default function TermsOfServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
