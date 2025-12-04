import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const recurring = cookieStore.get("kippenstummel-recurring-user");

  if (recurring?.value === "1") {
    redirect("/map");
  }

  redirect("/home");
}
