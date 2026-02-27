import { useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Coins,
  RefreshCw,
  HeartHandshake,
  MonitorSmartphone,
  Trophy,
} from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { FaqItem } from "@/components/molecules/FaqItem";
import { Leaderboard } from "@/components/organisms/Leaderboard";
import { HomeHero } from "@/components/molecules/HomeHero";
import { getTopRegionsGeoBalanced, REGIONS } from "@/lib/regions";

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

  const TOP_REGIONS = getTopRegionsGeoBalanced(REGIONS, 8);

  return (
    <div>
      <HomeHero slogan={t("slogan")} />
      <div className="mx-auto my-8 flex max-w-[80rem] flex-col items-center gap-12 p-4">
        <section className="flex flex-col items-center gap-10 p-4 text-slate-800 dark:text-white">
          <div className="max-w-[40rem] space-y-4">
            <div className="text-center text-lg font-semibold text-green-600">
              {t("features.slogan")}
            </div>
            <h4 className="text-center text-2xl font-bold">
              {t("features.title")}
            </h4>
            <div className="text-center">{t("features.description")}</div>
          </div>
          <div className="grid w-full max-w-[60rem] grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex justify-start gap-4 rounded-md bg-slate-50 p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900"
              >
                <div>
                  <feature.icon className="h-8 w-8 text-green-600 transition-transform duration-300 group-hover:scale-110" />
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
            <h4 className="font-semibold">{t("banner.title")}</h4>
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
              <h4 className="text-center text-2xl font-bold">
                {t("leaderboard.title")}
              </h4>
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
            <div>
              <Link
                href="/leaderboard"
                className="pressed:bg-green-800 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-green-600 px-5 py-2 text-center text-sm text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition hover:bg-green-700 hover:no-underline dark:border-white/10 dark:text-white dark:shadow-none"
              >
                <Trophy className="h-4 w-4" />
                {t("leaderboard.completeList")}
              </Link>
            </div>
          </div>
        </section>
        <section className="flex w-full flex-col items-center gap-10 p-4 text-slate-800 dark:text-white">
          <div className="max-w-[40rem] space-y-4">
            <h4 className="text-center text-2xl font-bold">{t("faq.title")}</h4>
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
        <section className="flex w-full flex-col items-center gap-10 p-4 text-slate-800 dark:text-white">
          <div className="max-w-[40rem] space-y-4">
            <h4 className="text-center text-2xl font-bold">
              {t("regions.title")}
            </h4>
          </div>
          <div className="mx-auto grid max-w-[40rem] grid-cols-2 gap-4 sm:grid-cols-4">
            {TOP_REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={`/cvms/region/${region.slug}`}
                className="text-center hover:underline"
              >
                {region.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
