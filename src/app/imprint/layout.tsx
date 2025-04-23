import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";

export const metadata: Metadata = {
  title: "Kippenstummel | Imprint",
};

export default function ImprintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
