import { useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Coins,
  RefreshCw,
  HeartHandshake,
  MonitorSmartphone,
} from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { JumbotronCta } from "@/components/organisms/JumbotronCta";
import { FaqItem } from "@/components/molecules/FaqItem";
import { Leaderboard } from "@/components/organisms/Leaderboard";

export default function Home() {
  const t = useTranslations("HomePage");

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
      <div className="relative w-full overflow-hidden pt-20 pb-32">
        <div className="preview absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm dark:bg-black/40" />
        <div className="relative z-20 flex flex-col gap-12 lg:flex-row lg:justify-center">
          <div className="flex flex-col items-center justify-center gap-8 p-4">
            <div className="space-y-2">
              <div className="flex flex-col items-center gap-2 text-center text-slate-600 md:flex-row md:gap-8 dark:text-slate-200">
                <div className="relative h-20 w-20 -rotate-16">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    fill
                    objectFit="contain"
                  />
                </div>
                <div className="text-4xl font-bold drop-shadow-lg md:text-6xl">
                  Kippenstummel
                </div>
              </div>
              <div className="text-center text-xl text-slate-500 drop-shadow-lg md:text-2xl dark:text-slate-400">
                &ldquo;{t("slogan")}&rdquo;
              </div>
            </div>
            <JumbotronCta />
          </div>
          <div className="flex justify-center pr-[5rem]">
            <div className="relative">
              <div className="w-[10rem]">
                <figure className="mx-auto aspect-[0.4614] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                  <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-800 p-0.5 shadow-[0_1rem_2rem_-1rem_rgb(45_55_75_/_20%),_0_1rem_2rem_-1rem_rgb(45_55_75_/_30%)] dark:bg-neutral-600 dark:shadow-[0_1rem_2rem_-1rem_rgb(0_0_0_/_20%),_0_1rem_2rem_-1rem_rgb(0_0_0_/_30%)]">
                    <div className="h-full w-full overflow-hidden rounded-md bg-white dark:bg-slate-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="h-full w-full object-cover dark:hidden"
                        src="/images/mockup/home-light.png"
                        alt="Mockup"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="hidden h-full w-full object-cover dark:block"
                        src="/images/mockup/home-dark.png"
                        alt="Mockup"
                      />
                    </div>
                  </div>
                </figure>
              </div>
              <div className="absolute top-1/6 left-1/2">
                <div className="w-[10rem]">
                  <figure className="mx-auto aspect-[0.4614] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-800 p-0.5 shadow-[0_1rem_2rem_-1rem_rgb(45_55_75_/_20%),_0_1rem_2rem_-1rem_rgb(45_55_75_/_30%)] dark:bg-neutral-600 dark:shadow-[0_1rem_2rem_-1rem_rgb(0_0_0_/_20%),_0_1rem_2rem_-1rem_rgb(0_0_0_/_30%)]">
                      <div className="h-full w-full overflow-hidden rounded-md bg-white dark:bg-slate-500">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="h-full w-full object-cover dark:hidden"
                          src="/images/mockup/map-light.png"
                          alt="Mockup"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="hidden h-full w-full object-cover dark:block"
                          src="/images/mockup/map-dark.png"
                          alt="Mockup"
                        />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto my-8 flex max-w-[80rem] flex-col items-center gap-12 p-4">
        <section className="flex flex-col items-center gap-10 p-4 text-slate-800 dark:text-white">
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
        <section className="flex w-full flex-col items-center gap-10 p-4 text-slate-800 dark:text-white">
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
        <section className="flex w-full flex-col items-center gap-10 p-4 text-slate-800 dark:text-white">
          <div className="flex max-w-[40rem] flex-col items-center space-y-4">
            <div className="flex items-center gap-1">
              <div className="relative h-8 w-8 overflow-hidden">
                <Image
                  src="/icons/laurel-branch-left.svg"
                  alt="Laurel Branch Left"
                  fill
                  objectFit="contain"
                  layout="fill"
                />
              </div>
              <div className="text-center text-2xl font-bold">
                {t("leaderboard.title")}
              </div>
              <div className="relative h-8 w-8 overflow-hidden">
                <Image
                  src="/icons/laurel-branch-right.svg"
                  alt="Laurel Branch Left"
                  fill
                  objectFit="contain"
                  layout="fill"
                />
              </div>
            </div>
            <div className="text-center">{t("leaderboard.description")}</div>
          </div>
          <div className="w-full max-w-[60rem] space-y-4">
            <Leaderboard />
          </div>
        </section>
        <section className="flex w-full flex-col items-center gap-10 p-4 text-slate-800 dark:text-white">
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
            <FaqItem
              id="faq-1"
              question={t("faq.items.1.question")}
              answer={t("faq.items.1.answer")}
            />
            <FaqItem
              id="faq-2"
              question={t("faq.items.2.question")}
              answer={t("faq.items.2.answer")}
            />
            <FaqItem
              id="faq-3"
              question={t("faq.items.3.question")}
              answer={t("faq.items.3.answer")}
            />
            <FaqItem
              id="faq-4"
              question={t("faq.items.4.question")}
              answer={t("faq.items.4.answer")}
            />
            <FaqItem
              id="faq-5"
              question={t("faq.items.5.question")}
              answer={t("faq.items.5.answer")}
            />
            <FaqItem
              id="faq-6"
              question={t("faq.items.6.question")}
              answer={t.rich("faq.items.6.answer", {
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
            />
            <FaqItem
              id="faq-7"
              question={t("faq.items.7.question")}
              answer={t("faq.items.7.answer")}
            />
            <FaqItem
              id="faq-8"
              question={t("faq.items.8.question")}
              answer={t("faq.items.8.answer")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
