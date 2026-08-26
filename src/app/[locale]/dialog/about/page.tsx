import { getTranslations } from "next-intl/server";
import { AboutDialogContent } from "@/components/organisms/navigation/AboutDialogContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutDialog" });

  return (
    <div className="mx-auto my-8 flex w-full max-w-2xl flex-col p-4">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
        <h1 className="my-0 text-xl leading-6 font-semibold">{t("title")}</h1>
        <AboutDialogContent />
      </div>
    </div>
  );
}
