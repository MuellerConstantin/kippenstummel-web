import type { Metadata } from "next";
import { RehydrationBoundary } from "@/store";

/**
 * Dialog routes exist to make overlays deep-linkable; their content is always
 * reachable elsewhere. Keep them out of the index but let crawlers follow the
 * links they contain.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

/**
 * Reached directly these routes render the identity and privacy state on their
 * own, so they wait for rehydration. As intercepted overlays they never do:
 * by the time one is opened the state has long been restored.
 */
export default function DialogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RehydrationBoundary>{children}</RehydrationBoundary>;
}
