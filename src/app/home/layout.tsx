import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";

export const metadata: Metadata = {
  title: "Kippenstummel | Home",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
