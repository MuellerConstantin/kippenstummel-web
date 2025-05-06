"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/components/atoms/Link";
import { Info } from "lucide-react";

export default function PrivacyPolicy() {
  const t = useTranslations("PrivacyPolicyPage");

  return (
    <div className="mx-auto my-8 flex w-full max-w-[80rem] flex-col gap-8 p-4 text-slate-800 dark:text-white">
      <h1 className="text-3xl font-bold">{t("headline")}</h1>
      <div className="flex items-center gap-4">
        <Info className="h-8 w-8 text-green-600" />
        <div>{t("disclaimer")}</div>
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("generic.title")}
        </h2>
        <h3 className="text-xl font-bold">{t("generic.dataPrivacy.title")}</h3>
        <p>{t.rich("generic.dataPrivacy.description", { br: () => <br /> })}</p>
        <h3 className="text-xl font-bold">{t("generic.responsible.title")}</h3>
        <p>
          {t.rich("generic.responsible.description", {
            br: () => <br />,
            link: (chunks) => (
              <Link href="mailto:info@mueller-constantin.de">{chunks}</Link>
            ),
          })}
        </p>
        <h3 className="text-xl font-bold">{t("generic.duration.title")}</h3>
        <p>{t("generic.duration.description")}</p>
        <h3 className="text-xl font-bold">
          {t("generic.generalInformation.title")}
        </h3>
        <p>{t("generic.generalInformation.description")}</p>
        <h3 className="text-xl font-bold">{t("generic.recipient.title")}</h3>
        <p>{t("generic.recipient.description")}</p>
        <h3 className="text-xl font-bold">{t("generic.revocation.title")}</h3>
        <p>{t("generic.revocation.description")}</p>
        <h3 className="text-xl font-bold">
          {t("generic.rightOfObjection.title")}
        </h3>
        <p>
          {t.rich("generic.rightOfObjection.description", { br: () => <br /> })}
        </p>
        <h3 className="text-xl font-bold">
          {t("generic.dataPortability.title")}
        </h3>
        <p>{t("generic.dataPortability.description")}</p>
        <h3 className="text-xl font-bold">
          {t("generic.informationCorrectionDeletion.title")}
        </h3>
        <p>{t("generic.informationCorrectionDeletion.description")}</p>
        <h3 className="text-xl font-bold">
          {t("generic.restrictionProcessing.title")}
        </h3>
        <div>
          {t.rich("generic.restrictionProcessing.description", {
            br: () => <br />,
            ul: (chunks) => <ul className="list-disc">{chunks}</ul>,
            li: (chunks) => <li className="ml-4">{chunks}</li>,
          })}
        </div>
        <h3 className="text-xl font-bold">{t("generic.ssl.title")}</h3>
        <p>{t("generic.ssl.description")}</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("hosting.title")}
        </h2>
        <p>{t("hosting.description")}</p>
        <h3 className="text-xl font-bold">{t("hosting.hetzner.title")}</h3>
        <p>
          {t.rich("hosting.hetzner.description", {
            br: () => <br />,
            link: (chunks) => (
              <Link href="https://www.hetzner.com/de/legal/privacy-policy/">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("dataCollection.title")}
        </h2>
        <h3 className="text-xl font-bold">
          {t("dataCollection.cookies.title")}
        </h3>
        <p>
          {t.rich("dataCollection.cookies.description", {
            br: () => <br />,
          })}
        </p>
        <h3 className="text-xl font-bold">
          {t("dataCollection.localStorage.title")}
        </h3>
        <p>
          {t.rich("dataCollection.localStorage.description", {
            br: () => <br />,
          })}
        </p>
        <h3 className="text-xl font-bold">
          {t("dataCollection.location.title")}
        </h3>
        <p>
          {t.rich("dataCollection.location.description", {
            br: () => <br />,
          })}
        </p>
        <h3 className="text-xl font-bold">{t("dataCollection.logs.title")}</h3>
        <div>
          {t.rich("dataCollection.logs.description", {
            br: () => <br />,
            ul: (chunks) => <ul className="list-disc">{chunks}</ul>,
            li: (chunks) => <li className="ml-4">{chunks}</li>,
          })}
        </div>
        <h3 className="text-xl font-bold">
          {t("dataCollection.contact.title")}
        </h3>
        <p>
          {t.rich("dataCollection.contact.description", {
            br: () => <br />,
          })}
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          {t("thirdParty.title")}
        </h2>
        <h3 className="text-xl font-bold">{t("thirdParty.osm.title")}</h3>
        <p>
          {t.rich("thirdParty.osm.description", {
            br: () => <br />,
          })}
        </p>
      </section>
    </div>
  );
}
