import { RehydrationBoundary } from "@/store";

/**
 * The interactive half of the app.
 *
 * The content routes deliberately sit outside this group: waiting costs them
 * server rendering, and they have nothing to wait for.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RehydrationBoundary>{children}</RehydrationBoundary>;
}
