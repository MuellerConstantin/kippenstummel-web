"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Coins,
  RefreshCw,
  HeartHandshake,
  MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@/components/atoms/Disclosure";
import { Link } from "@/components/atoms/Link";

export default function Home() {
  const t = useTranslations("HomePage");
  const router = useRouter();

  const features = useMemo(() => {
    return [
      {
        title: t("features.items.simple.title"),
        description: t("features.items.simple.description"),
        icon: Coins,
      },
      {
        title: t("features.items.current.title"),
        description: t("features.items.current.description"),
        icon: RefreshCw,
      },
      {
        title: t("features.items.community.title"),
        description: t("features.items.community.description"),
        icon: HeartHandshake,
      },
      {
        title: t("features.items.device.title"),
        description: t("features.items.device.description"),
        icon: MonitorSmartphone,
      },
    ];
  }, [t]);

  return (
    <div>
      <div className="relative h-[30rem] w-full">
        <div className="absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-xs">
          <div className="flex flex-col items-center justify-center gap-8 p-4">
            <div className="space-y-2">
              <div className="flex flex-col items-center gap-2 text-center text-slate-600 md:flex-row md:gap-8">
                <div className="relative h-32 w-32 -rotate-16">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    fill
                    objectFit="contain"
                  />
                </div>
                <div className="text-4xl font-bold md:text-6xl">
                  Kippenstummel
                </div>
              </div>
              <div className="text-center text-xl text-slate-500 md:text-2xl">
                &ldquo;{t("slogan")}&rdquo;
              </div>
            </div>
            <div>
              <Button
                onPress={() => router.push("/map")}
                className="p-3 font-bold"
              >
                {t("cta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto my-8 flex max-w-[80rem] flex-col items-center gap-16 p-4">
        <section className="flex flex-col items-center gap-16 p-4 text-slate-800 dark:text-white">
          <div className="max-w-[40rem] space-y-4">
            <div className="text-center text-lg font-semibold text-green-600">
              {t("features.slogan")}
            </div>
            <div className="text-center text-2xl font-bold">
              {t("features.title")}
            </div>
            <div className="text-center">{t("features.description")}</div>
          </div>
          <div className="grid w-full max-w-[60rem] grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex justify-start gap-4 rounded-md bg-slate-50 p-4 dark:bg-slate-900"
              >
                <div>
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="font-bold">{feature.title}</div>
                  <div>{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="flex w-full flex-col items-center gap-16 p-4 text-slate-800 dark:text-white">
          <div className="flex w-full max-w-[60rem] flex-col gap-4 rounded-md bg-green-50 p-4 dark:bg-green-900">
            <div className="font-semibold">{t("banner.title")}</div>
            <div>
              {t.rich("banner.description", {
                link1: (chunks) => (
                  <Link target="_blank" href="www.rauchfrei-info.de">
                    {chunks}
                  </Link>
                ),
                link2: (chunks) => (
                  <Link target="_blank" href="tel:08008313131">
                    {chunks}
                  </Link>
                ),
              })}
            </div>
          </div>
        </section>
        <section className="flex w-full flex-col items-center gap-16 p-4 text-slate-800 dark:text-white">
          <div className="max-w-[40rem] space-y-4">
            <div className="text-center text-2xl font-bold">
              {t("faq.title")}
            </div>
            <div className="text-center">
              {t.rich("faq.description", {
                link: (chunks) => (
                  <Link href="mailto:info@mueller-constantin.de">{chunks}</Link>
                ),
              })}
            </div>
          </div>
          <div className="flex w-full max-w-[60rem] flex-col gap-4">
            <Disclosure>
              <DisclosureHeader>{t("faq.items.1.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.1.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.2.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.2.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.3.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.3.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.4.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.4.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.5.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.5.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.6.question")}</DisclosureHeader>
              <DisclosurePanel>
                {t.rich("faq.items.6.answer", {
                  link1: (chunks) => (
                    <Link target="_blank" href="https://rauchfrei-info.de">
                      {chunks}
                    </Link>
                  ),
                  link2: (chunks) => (
                    <Link target="_blank" href="https://www.dhs.de/">
                      {chunks}
                    </Link>
                  ),
                })}
              </DisclosurePanel>
            </Disclosure>
          </div>
        </section>
      </div>
    </div>
  );
}
