import type { Metadata } from "next";
import { MapTemplate } from "@/components/templates/MapTemplate";
import { buildPageMetadata } from "@/lib/server/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    namespace: "TransferPage",
    path: "/transfer",
    robots: { index: false, follow: false },
  });
}

export default function TransferLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MapTemplate>{children}</MapTemplate>;
}
