import type { Metadata } from "next";

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

export default function DialogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
