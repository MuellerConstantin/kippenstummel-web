import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    namespace: "PrivacyPolicyPage",
    path: "/privacy-policy",
  });
}

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
