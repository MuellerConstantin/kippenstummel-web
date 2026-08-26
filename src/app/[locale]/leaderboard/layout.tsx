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
    namespace: "LeaderboardPage",
    path: "/leaderboard",
    robots: { index: false, follow: true },
  });
}

export default function LeaderboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
