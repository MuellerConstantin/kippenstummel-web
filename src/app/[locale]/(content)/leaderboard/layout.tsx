import type { Metadata } from "next";
import { Suspense } from "react";
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
  return (
    <StackTemplate>
      {/* The page reads its pagination from the query string and loads every
          entry through SWR, so it renders on the client either way. */}
      <Suspense>{children}</Suspense>
    </StackTemplate>
  );
}
