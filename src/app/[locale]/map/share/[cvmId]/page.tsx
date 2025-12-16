import { redirect } from "next/navigation";

type Props = {
  params: {
    locale: string;
    cvmId: string;
  };
};

export default function SharePage({ params }: Props) {
  const { locale, cvmId } = params;

  redirect(`/${locale}/map?shared=${cvmId}`);
}
