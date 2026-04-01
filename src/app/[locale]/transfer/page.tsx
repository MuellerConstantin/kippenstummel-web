import { TransferView } from "@/components/organisms/ident/TransferView";
import { redirect } from "next/navigation";

export default async function Transfer(props: PageProps<"/[locale]/transfer">) {
  const { token } = await props.searchParams;

  if (!token || typeof token !== "string") {
    return redirect("/not-found");
  }

  return <TransferView />;
}
