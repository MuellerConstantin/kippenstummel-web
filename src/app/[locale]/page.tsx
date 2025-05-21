"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/store";

export default function Root() {
  const recurringUser = useAppSelector(
    (state) => state.usability.recurringUser,
  );

  if (recurringUser) {
    redirect("/map");
  } else {
    redirect("/home");
  }
}
