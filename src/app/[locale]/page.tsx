"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/store";

export default function Root() {
  const recurringUser = useAppSelector((state) => state.theme.recurringUser);

  if (recurringUser) {
    redirect("/map");
  } else {
    redirect("/home");
  }
}
