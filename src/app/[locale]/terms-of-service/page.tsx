"use client";

import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { Link } from "@/components/atoms/Link";

export default function TermsOfService() {
  const t = useTranslations("TermsOfServicePage");

  return (
    <div className="mx-auto my-8 flex w-full max-w-[80rem] flex-col gap-8 p-4 text-slate-800 dark:text-white">
      <h1 className="text-3xl font-bold">{t("headline")}</h1>
      <div className="flex items-center gap-4">
        <Info className="h-8 w-8 text-green-600" />
        <div>{t("disclaimer")}</div>
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("scope.title")}
        </h2>
        <p>
          {t.rich("scope.description", {
            br: () => <br />,
            link: (chunks) => (
              <Link href="mailto:info@mueller-constantin.de">{chunks}</Link>
            ),
          })}
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("requirements.title")}
        </h2>
        <p>{t("requirements.description")}</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("content.title")}
        </h2>
        <p>{t("content.description")}</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("userDuties.title")}
        </h2>
        <div>
          {t.rich("userDuties.description", {
            br: () => <br />,
            ul: (chunks) => <ul className="list-disc">{chunks}</ul>,
            li: (chunks) => <li className="ml-4">{chunks}</li>,
          })}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("userContent.title")}
        </h2>
        <div>
          {t.rich("userContent.description", {
            br: () => <br />,
          })}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("facilitation.title")}
        </h2>
        <div>
          {t.rich("facilitation.description", {
            br: () => <br />,
          })}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("liability.title")}
        </h2>
        <div>
          {t.rich("liability.description", {
            br: () => <br />,
          })}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">{t("hint.title")}</h2>
        <div>
          {t.rich("hint.description", {
            br: () => <br />,
          })}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("alteration.title")}
        </h2>
        <div>
          {t.rich("alteration.description", {
            br: () => <br />,
          })}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("closingProvisions.title")}
        </h2>
        <div>
          {t.rich("closingProvisions.description", {
            br: () => <br />,
          })}
        </div>
      </section>
    </div>
  );
}
