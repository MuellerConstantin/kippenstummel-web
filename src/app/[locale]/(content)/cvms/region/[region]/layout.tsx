import { StackTemplate } from "@/components/templates/StackTemplate";

export default function CvmRegionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
