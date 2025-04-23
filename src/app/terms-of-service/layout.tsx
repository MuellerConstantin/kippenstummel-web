import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";

export const metadata: Metadata = {
  title: "Kippenstummel | Terms of Service",
};

export default function TermsOfServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
