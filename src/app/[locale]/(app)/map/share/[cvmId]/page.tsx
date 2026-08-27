import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; cvmId: string }>;
};

export default async function SharePage({ params }: Props) {
  const { locale, cvmId } = await params;

  redirect(`/${locale}/map?shared=${cvmId}`);
}
