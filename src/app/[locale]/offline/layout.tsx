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
    namespace: "OfflinePage",
    path: "/offline",
    robots: { index: false, follow: false },
  });
}

export default function OfflineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
