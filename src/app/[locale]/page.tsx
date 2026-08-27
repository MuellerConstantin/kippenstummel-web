import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";

export default async function RootPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  const cookieStore = await cookies();
  const recurring = cookieStore.get("kippenstummel-recurring-user");

  redirect({
    href: recurring?.value === "1" ? "/map" : "/home",
    locale,
  });
}
