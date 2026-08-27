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
    namespace: "HomePage",
    path: "/home",
    withDescription: true,
  });
}

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
