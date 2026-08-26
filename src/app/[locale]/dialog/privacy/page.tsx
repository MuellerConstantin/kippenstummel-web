"use client";

import { useRouter } from "@/i18n/navigation";
import { PrivacySettingsDialogContent } from "@/components/organisms/PrivacySettingsDialogContent";

export default function Page() {
  const router = useRouter();

  return (
    <div className="mx-auto my-8 flex w-full max-w-xl flex-col p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
        <PrivacySettingsDialogContent
          variant="details"
          onClose={() => router.push("/home")}
        />
      </div>
    </div>
  );
}
