import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";

export const metadata: Metadata = {
  title: "Kippenstummel | Privacy Policy",
};

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
