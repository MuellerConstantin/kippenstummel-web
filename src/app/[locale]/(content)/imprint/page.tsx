import { Link } from "@/components/atoms/Link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Imprint({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("ImprintPage");

  return (
    <div className="mx-auto my-8 flex w-full max-w-[80rem] flex-col gap-8 p-4 text-slate-800 dark:text-white">
      <h1 className="text-3xl font-bold">{t("headline")}</h1>
      <div className="space-y-2">
        <div className="font-semibold">{t("declaration")}</div>
        <div>
          <div>Constantin Müller</div>
          <div>Agathenstraße 46</div>
          <div>76189 Karlsruhe, Deutschland</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="font-semibold">{t("contact")}</div>
        <div>
          <div>
            Email:{" "}
            <Link href="mailto:info@mueller-constantin.de">
              info@mueller-constantin.de
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Info className="h-6 w-6 shrink-0 text-green-600" />
        <div>{t("disclaimer")}</div>
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("copyright.title")}
        </h2>
        <p>{t("copyright.description")}</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("links.title")}
        </h2>
        <p>{t("links.description")}</p>
      </section>
    </div>
  );
}
